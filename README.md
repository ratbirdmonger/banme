# banme
**B**raveexvius **A**utomated **N**uisance **M**itigation **E**ngine

## Requirements
* Jailbroken iOS device with resolution 1536 x 2048: iPad generations 3-6.
* The [Autotouch](https://docs.autotouch.net/) app. Demo will timeout after 1 minute so you need to purchase a license.
    * Be able to figure out how to copy the scripts to your device. I use [WinSCP](https://winscp.net/eng/index.php) and enable WebDAV on Autotouch.
* You need to be able to program Javascript. You need to read much of the code to understand what it's doing so you can modify it for your own needs. Much of it won't work out of the box - you need to tell it which abilities to use on which units.
* You need to be ok with getting banned and/or the script running amok. It has some safety checks but theoretically if the right sequence of taps happens, it can do horrible things like: sell your units, buy money bundles, use your tickets, etc. I treat it like I would a self-driving car. It's a convenience feature but I take full responsibility if I take my hands off the wheel and it gets me into trouble.

## Disclaimers
* <span style="color:red">**As the name of the project implies, you may get banned for using this.**</span>
    * Why doesn't this bother me? This game is not worth the time if I have to manually grind all this crap. If the developer wants to ban a paying customer who isn't gaining any in-game advantage, so be it. I have better things to do than "work hard" on a mobile game.
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
* Watch and click through 7 ads. Ads gradually get more difficult to defeat as time goes on, so this feature will need updates in the future.

## Hourly bullshit clearing
* Claim completed expeditions, launch new ones.
* Check for raid orbs, use them up. Executes whatever sequence you program in. 
    * For this week's raid (2020-9-30) my sequence is to steal & break then do a 3x chain with 2 units.
* Check for arena orbs, use them up. Executes whatever sequence you program in. 
    * My current sequence is: Bonus unit uses frozen hurricane, then 3 CWA triple-chainers chain, then when the esper gauge is full, healer summons Odin. If the enemy is particularly bulky, it's ok, it will repeat the sequence. If someone dies, the healer will notice and raise the whole party instead of summoning Odin.
* If there's energy left, do some MK farming or insignia farming

## On-demand bullshit 
* Item World - user selects the item, programs in the priority order of enhancements, then the script runs through all 10 orbs (or whatever is left) and automatically selects the best enhancements each turn, discarding abilities as necessary
	
## To do if I get sufficiently annoyed
* 3/4\* unit fusing. 
    * Not hard but will be a slow-running script: Click each unit and see if there are any "Trust up" units when you go to select units to fuse.