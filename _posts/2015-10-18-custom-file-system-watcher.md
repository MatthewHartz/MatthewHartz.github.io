---
layout: post
title: "Custom File System Watcher for Locked Files"
date: 2015-10-08 -0800
comments: true
categories: [C#, FileSystemWatcher, File locking]
---

At work last Friday, I had to tackle a small issue that was causing me some headaches.  
I created a C\# [FileSystemWatcher](https://msdn.microsoft.com/en-us/library/system.io.filesystemwatcher(v=vs.110).aspx "FileSystemWatcher")
to monitor a log file used by an ETL tool.  I'm currently writing an integration testing tool to test one of our applications, while
simultaneously regression testing it.  This ETL tool logs every file that it encounters after it is finished processing it.  So, within my 
integration tool, I want to implement a FileSystemWatcher to make sure that my file is successfully processed before I move onto the next
phase of a test.

Unfortunately, the application continuously holds multiple locks on this file because in practice this file is constantly logged with a 
rolling appender.  This locking mechanism prevents my FileSystemWatcher to be able to detect a change, which is obviously bad.

To quickly combat this, I wrote a simple FileSystemWatcher that works similar(ish) to the default C\# file system watcher.

### The Code Itself

```C#
public class CustomFileWatcher
{
	public string _path;
	public event EventHandler _fileProcessed;
	public event FileSystemEventHandler Changed;

	public CustomFileWatcher()
	{
		_path = ConfigurationManager.AppSettings["logfile"];
		Changed += OnChanged;
	}

	public CancellationTokenSource Run()
	{
		var tokenSource = new CancellationTokenSource();
		var ct = tokenSource.Token;

		// Get current status of the file
		var sha1 = HashAlgorithm.Create();
		byte[] hash;
		byte[] tempHash;

		//var fullfiledata = new FileStream(e.FullPath, FileMode.Open, FileAccess.Read, FileShare.ReadWrite);
		using (FileStream stream = new FileStream(_path, FileMode.Open, FileAccess.Read, FileShare.ReadWrite))
			hash = sha1.ComputeHash(stream);

		var task = Task.Factory.StartNew(() =>
		{
			// Poll file for changes
			while (!ct.IsCancellationRequested)
			{
				using (FileStream stream = new FileStream(_path, FileMode.Open, FileAccess.Read, FileShare.ReadWrite))
					tempHash = sha1.ComputeHash(stream);

				if (!hash.SequenceEqual(tempHash))
				{
					hash = tempHash;
					Changed.Invoke(null, 
						new FileSystemEventArgs(WatcherChangeTypes.Changed,
							Path.GetDirectoryName(_path),
							Path.GetFileName(_path)));
				}
				Thread.Sleep(50);
			}
			
		}, tokenSource.Token);

		return tokenSource;
	}

	public void Stop(CancellationTokenSource token)
	{
		token.Cancel();
	}
	
	private void OnChanged(object source, FileSystemEventArgs e)
	{
		// Whatever the heck you want it to do
	}
}
```
