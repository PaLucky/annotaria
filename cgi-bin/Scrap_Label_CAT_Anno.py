#!/usr/bin/python
# -*- coding: UTF-8 -*-

import urllib2
from bs4 import BeautifulSoup
import cgi, cgitb 
import json
Dizionario=[]
form = cgi.FieldStorage() 
#link = form.getvalue('link') 
link='http://www.discogs.com/artist/668917-Maztek?page=2'
hdr = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11',
       'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
       'Accept-Charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.3',
       'Accept-Encoding': 'none',
       'Accept-Language': 'en-US,en;q=0.8',
       'Connection': 'keep-alive'}
req = urllib2.Request(link,headers=hdr)
html = urllib2.urlopen(req)
soup = BeautifulSoup(html)


tag = soup.find_all("td",attrs={"class": "label has_header"})

for i in tag:
	Dizionario+=[{ "lab" :  i.next.next }]
	


tag = soup.find_all("td",attrs={"class": "year has_header"})

for i in tag:
	Dizionario+=[{ "anno" :  i.next }]
	


tag = soup.find_all("td",attrs={"class": "catno_first"})

for i in tag:
	#i = soup.find({"class" : "credits"})
	#i = soup.find_all("td",attrs={"class": "label has_header"})
	Dizionario+=[{ "cat" :  i.next.next }]

	


print "Content-Type: application/json \n\n"
print json.dumps(Dizionario)
