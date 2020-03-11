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
    if hostnames[record] == "pi":
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
