# banme
**B**raveexvius **A**utomated **N**uisance **M**itigation **E**ngine

## Requirements
* Jailbroken iOS device with resolution 1536 x 2048: iPad generations 3-6.
* The [Autotouch](https://docs.autotouch.net/) app. Demo will timeout after 1 minute so you need to purchase a license.
    * Be able to figure out how to copy the scripts to your device. I use [WinSCP](https://winscp.net/eng/index.php) and enable WebDAV on Autotouch.
* You need to be able to program Javascript. You need to read much of the code to understand what it's doing so you can modify it for your own needs. Much of it won't work out of the box - you need to tell it which abilities to use on which units.
* You need to be ok with getting banned and/or the script running amok. It has some safety checks but theoretically if the right sequence of taps happens, it can do horrible things like: sell your units, buy money bundles, use your tickets, etc. I treat it like I would a self-driving car. It's a convenience feature but I take full responsibility if I take my hands off the wheel and it gets me into trouble.

## Disclaimers
* **As the name of the project implies, you may get banned for using this.**
* This has only been tested on an jailbroken iPad 6th gen with resolution 1536 x 2048
    * Requires the autotouch app (which requires jailbreak)
    * These scripts will likely work on other iOS devices with the exact same resolution: iPad 3rd gen - 5th gen
    * These scripts will almost certainly not work on other resolutions due to the fact that much of the logic depends on exact pixel matching. This presents two problems:
        * The coordinates of UI elements will change. This probably wouldn't be too hard to work around by having a translation layer to abstract the logic from the exact pixel coordinates.
        * The game upsamples/downsamples its source images as necessary to render on screen, so if the device resolution changes then many pixel's colors will change as neighboring pixels get blended differently. This is difficult to work around. You would need to sample pixels from the same screens by hand for a different resolution.
* I do this for myself and don't have time to do tech support. I want to help humanity by letting other players enjoy the game without the mind-numbing tedium, but my altruism only goes so far.

## Programming constructs
* You can program in which abilities to use for which unit, on a turn by turn basis, then choose the timing that they use to activate.
* "Wait for X condition" logic, for example in arena I send 3 chainers, and wait for esper gauge to be filled, so when it's ready I can summon Odin during the chain.
* For battles, it selects your party with the name you specify (Raid, MK, etc.), then attempts to find bonus units on your friend list. Use the predefined actions you program in.

## Basic bullshit
* Cactuar fusing
* Configurable chaining
    * Spark chaining is unreliable, I could not get it to consistently work. The javascript interpreter used by autotouch does not have a real-time/deterministic execution engine. Almost all common chaining families will still work, except for those that require spark chains.

## Daily bullshit clearing
* Buy the cactaur bundle. Double checks in place to make sure the wrong bundle doesn't get picked!
* Send/receive gifts, click the share button
* Watch and click through 7 ads - I will not publish the code for this because circumventing ads is a huge deal for ad exchanges and their partners. But I will give some hints - it works by doing image analysis on both corners of the screen to determine which one is most likely the X button. 

## Hourly bullshit clearing
* Claim completed expeditions, launch new ones.
* Check for raid orbs, use them up. Executes whatever sequence you program in. 
    * For this week's raid (2020-9-30) my sequence is to steal & break then do a 3x chain with 2 units.
* Check for arena orbs, use them up. Executes whatever sequence you program in. 
    * My current sequence is: Bonus unit uses frozen hurricane, then 3 CWA triple-chainers chain, then when the esper gauge is full, summon Odin. Sometimes it takes multiple turns, which is fine. Once in a while (1 out of 50 battles) if I happen to be watching and I run into a 3+ Kuja/UDDarkFina team that goes forst, I take over and manually do the battle. I'm not motivated enough to automate this.
* If there's energy left, do some MK farming or insignia farming
	
## To do if I get sufficiently annoyed
* 3/4\* unit fusing. 
    * Not hard but will be a slow-running script: Click each unit and see if there are any "Trust up" units when you go to select units to fuse.
* Item World
    * Easy implementation - user selects the item, then script runs through all 10 orbs, pausing each battle for user to select the enhancements
    * Harder implementation - user selects the item, programs in the priority order of enhancements, then the script runs through all 10 orbs and automatically selects the enhancements each turn