---
layout: post
title:  "Raspberry Pi: Setup and first steps"
date:   2013-03-17 00:00:00 -0700
---

I recently purchased a [Raspberry Pi](http://www.raspberrypi.org) to play
around with. It's my first computer solely dedicated to running a linux
operating system (with root priveleges). I decided to install
[Rasbian](http://www.rasbian.org/), the suggested OS (based on Debian), and
I've purchased an Edimax USB wifi dongle, as it's supported without any extra
configuration. Setting it up was quite easy, as there are numerous tutorials
and instructions around the web.

The first thing I decided to do was get some of my basic linux tools working. I
installed tmux and got my .bashrc, .bash_aliases, and .tmux.conf files set to
my tastes. In order to get wireless working, I had to use the GUI wireless
configuration, but it's completely possible to do through the terminal (or over
ssh). I also set my router to assign a specific IP address to the Raspberry
Pi's etherent and wireless connection based off their MAC addresses.

I then decided to set up a web server as I'd never done it from scratch. I used
the super useful `sudo apt-get ` to install Apache, PHP, and MySQL, restarted,
and was set up. My router's config allows for redirection of specific ports to
certain internal IP addresses, to port 80 (web server) is now pointing to the
Raspbery Pi's IP.

I use [namecheap](http://www.namecheap.com/?aff=46677) as my domain name
registrar, and a quick internet search led me to a guy who used python to
[dynamically change his DNS
settings](http://networkprogramming.wordpress.com/2013/02/15/servedwithpi-com-a-tiny-webserver/)
to point to the Raspberry Pi. After testing his code and concept, I found that
it clears all DNS records before setting any, and for this reason, wouldn't
work for my purpose, as I wanted to access the site on my Pi at
[sitkum.camlittle.com](http://sitkum.camlittle.com). With a little
investigating and Python coding, I came up with a script that updates the
correct subdomain without removing the other DNS records. It also checks if the
record is already set correctly, and stops if so.

Here's the code.

{% highlight python %}
import urllib
import xml.dom.minidom as minidom
from sys import exit

print "starting..."

# variables
SLD = "camlittle" # domain name
TLD = "com"
apikey = "<api key>"
username = "<username>"

# get the Pi's IP address
response = urllib.urlopen("http://dananos.brinkster.net/ip.php")
ip = response.read()
print "got ip " + ip

# api command
request_head = "http://api.namecheap.com"
request_head += "/xml.response?"
request_head += "apiuser=" + username
request_head += "&apikey=" + apikey
request_head += "&username=" + username
request_head += "&ClientIp=<this IP must be allowed via namecheap's api settings. I used the Pi's local ip"
request_head += "&SLD=" + SLD
request_head += "&TLD=" + TLD
request_head += "&Command=namecheap.domains.dns."

# this submits the request and returns the XML response
def request(command):
    url = request_head + command
    print "calling " + url
    response = urllib.urlopen(url)
    return response

# save the existing DNS information in these arrays
hostnames = []
recordtypes = []
addresses = []
mxprefs = []
ttls = []

# get existing DNS information
request_command = "getHosts"
print "getting host records for " + SLD + "." + TLD

xml = request(request_command)
xml_dom = minidom.parse(xml)
hosts = xml_dom.documentElement.getElementsByTagName('host')
# loop through and save
for host in hosts:
    for attr, value in host.attributes.items():
        if attr == "Name":
            hostnames.append(value)
        elif attr == "Type":
            recordtypes.append(value)
        elif attr == "Address":
            addresses.append(value)
        elif attr == "MXPref":
            mxprefs.append(value)
        elif attr == "TTL":
            ttls.append(value)

# set DNS information
request_command = "setHosts"
for record in range(len(hostnames)):
    num = record + 1
    request_command += "&HostName" + str(num) + "=" + hostnames[record]
    request_command += "&RecordType" + str(num) + "=" + recordtypes[record]
    request_command += "&Address" + str(num) + "="
    # change IP address for the Pi
    if hostnames[record] == "sitkum": # subdomain
        # if it's already correct, don't do anything
        if ip == addresses[record]:
            print "dns record is set correctly"
            exit()
        request_command += ip
    else:
        request_command += addresses[record]
    request_command += "&MXPref" + str(num) + "=" + mxprefs[record]
    request_command += "&TTL" + str(num) + "=" + ttls[record]
response = request(request_command).read()
print "response is...\n" + response
{% endhighlight %}

It's worked so far, but as I haven't moved my Pi to a network with a different
IP address, I can't say for sure. I'll be testing more fully over Spring break.
I've set up a cron job to run it every hour.

The Raspberry Pi is perfectly capable of hosting a
[full](http://www.dingleberrypi.com) [site](http://www.servedwithpi.com), but,
for me, it's not worthwhile. A real web host provides much better security,
uptime, power, and bandwidth. Ultimately, I want to mess with my Pi without
having to worry about crashing my website.

The real advantage to this dynamic dns setup is ssh. I'm now able to ssh in
without knowing the actual IP address of the Pi. It's not a perfect system yet,
as port 22 will not be forwarded correctly on other routers, but learning is
why I got the Pi. It really is an amazingly fun, affordable, way to get more
comforable with Linux and hacking in general.
