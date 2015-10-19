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




The shaman squatted next to the entrails on the ground and stared intently at the pattern formed by the splatter. There was something there, but confirmation was needed. Turning away from the decomposing remains, the shaman consulted the dregs of a cup of tea, searching the shifting patterns of the swirling tea leaves for corroboration. There it was. A decision could be made. "Yes, this person will be successful here. We should hire this person."

![Spring Pouchong tea - CC BY SA 3.0 by Richard Corner ](https://cloud.githubusercontent.com/assets/19977/9565095/3e6e5c4c-4e70-11e5-8023-6aa1f81c31dd.png)

Such is the state of hiring developers today.

### Our approach to hiring is misguided

The approach to hiring developers and managing their performance afterwards at many if not most tech companies is based on age old ritual and outdated ideas of what predicts how an employee will perform. Most of it ends up being very poor at predicting success and rife with bias.

For example, remember when questions like "How would you move Mt. Fuji?" were all the rage at companies like Microsoft and Google? The hope was that in answering such questions, the interviewee would demonstrate clever problem solving skills and intelligence. Surely this would help hire the best and brightest?

Nope.

According to Google�s Senior VP of People Operations Laszlo Bock, Google long ago realized [these questions were complete wastes of time](http://www.deathandtaxesmag.com/200732/google-admits-its-famous-job-interview-questions-were-a-complete-waste-of-time/).

> Years ago, we did a study to determine whether anyone at Google is particularly good at hiring. We looked at tens of thousands of interviews, and everyone who had done the interviews and what they scored the candidate, and how that person ultimately performed in their job. We found zero relationship.

### We're not the first to face this

Our industry is at a stage where we are rife with superstition about what factors predict putting together a great team. This [sounds eerily familiar](https://en.wikipedia.org/wiki/Moneyball).

> The central premise of Moneyball is that the collected wisdom of baseball insiders (including players, managers, coaches, scouts, and the front office) over the past century is subjective and often flawed. Statistics such as stolen bases, runs batted in, and batting average, typically used to gauge players, are relics of a 19th-century view of the game and the statistics available at that time.

Moneyball, a book by Michael Lewis documents how the Oakland Athletics baseball team decided to ignore tradition and use an evidence-based statistical approach to figuring out what makes a strong baseball team. This practice of using empirical statistical analysis towards baseball became known as [sabermetrics](https://en.wikipedia.org/wiki/Sabermetrics).

Prior to this approach, conventional wisdom looked at stolen bases, runs batted in, and batting average as indicators of success. Home run hitters were held in especially high esteem, even those with low batting averages. It was not unlike our industry's fascination with hiring Rock Stars. But the sabermetrics approach found otherwise.

> Rigorous statistical analysis had demonstrated that on-base percentage and slugging percentage are better indicators of offensive success.

Did it work?

> By re-evaluating the strategies that produce wins on the field, the 2002 Athletics, with approximately US$44 million in salary, were competitive with larger market teams such as the New York Yankees, who spent over US$125 million in payroll that same season...This approach brought the A's to the playoffs in 2002 and 2003.

### Moneyball of Hiring

It makes me wonder, where is the Moneyball of software hiring and performance management?

Companies like Google, as evidenced by the previously mentioned study, are applying a lot of data to the analysis of [hiring and performance management](http://www.theatlantic.com/business/archive/2013/10/how-google-uses-data-to-build-a-better-worker/280347/). I bet that analysis is a competitive advantage in their ability to hire the best and form great teams. It gives them the ability to hire people overlooked by other companies still stuck in the superstition that making candidates code on white boards or reverse linked lists will find the best people.

Even so, this area is ripe to apply more science to it and study it on a grander scale. I would love to see multiple large companies collect and share this data for the greater good of the industry and society at large. Studies like this often are a force in [reducing unconscious bias and increasing diversity](http://www.upworthy.com/this-orchestras-blind-audition-proves-bias-sneaks-in-when-you-least-expect-it).

Having this data in the open might remove this one competitive advantage in hiring, but companies can still compete by offering interesting work, great compensation, and benefits.

The good news is, there are a lot of people and companies thinking about this. This article,  [What's Wrong with Job Interviews, and How to Fix Them](https://www.linkedin.com/pulse/20130610025112-69244073-will-smart-companies-interview-your-kids) is a great example.

### We'll never get it right

Even with all this data, we'll never perfect hiring. Studying human behavior is a tricky affair. If we could predict it well, the stock market would be completely predictable.

Companies should embrace the fact that they will often be wrong. They will make mistakes in hiring. As much time as a company spends attempting to make their hiring process rock solid, they should also spend a similar amount of time building humane systems for correcting hiring mistakes. This is a theme I've touched upon before - the [inevitability of failure](http://haacked.com/archive/2015/02/07/failure-and-repair/).

