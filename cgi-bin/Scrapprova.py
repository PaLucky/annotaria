#!/usr/bin/python
# -*- coding: UTF-8 -*-

import urllib2
from bs4 import BeautifulSoup
import cgi, cgitb 
import json
Dizionario=[]
form = cgi.FieldStorage() 
disc='http://www.discogs.com/'
#link = form.getvalue('link') 
link='http://www.discogs.com/artist/167247-Prolix'
#link2='http://www.discogs.com/artist/96593-The-Upbeats'
hdr = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11',
       'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
       'Accept-Charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.3',
       'Accept-Encoding': 'none',
       'Accept-Language': 'en-US,en;q=0.8',
       'Connection': 'keep-alive'}
req = urllib2.Request(link,headers=hdr)
html = urllib2.urlopen(req)
soup = BeautifulSoup(html)

#tag = soup.find(attrs={"class": "credits"})
#tag = soup.a.href






tag = soup.find_all("td",attrs={"class": "title"})


#for i in tag:
#	leng=len(i.contents)
#	for d in i.find_all("a",recursive=False):
#		
for i in tag:
	for d in i.find_all("a",recursive=False):
		#print d['href']   == i link delle release
		Dizionario+=[{ "tit" :  d.string }]
		#print d.string  #== titolo release
		#print d['href']
		link_tit= disc + d['href']
		req2 = urllib2.Request(link_tit,headers=hdr)
		html2 = urllib2.urlopen(req2)
		soup2 = BeautifulSoup(html2)

		tag2= soup2.find_all("span" , attrs={"class":'tracklist_track_title'})
		#print len(tag2)
		
		tracklist= ''
		for z in tag2:
			tracklist= tracklist  + z.string + '++'
			#print z.string == titolo di una traccia
		#print tracklist == "Venom++Paranoia++Blindsight++""
		Dizionario+=[{ "tracklist" :  tracklist }]

		tag3= soup2.find_all("td" , attrs={"class":'tracklist_track_duration'})
		duratelist=''
		for l in tag3:
			#print l.contents
			if ((len(l.contents))>1):
				#print l.contents[3].next # == <span>6:19</span>
				duratelist= duratelist + l.contents[3].next + '++'
		Dizionario+=[{ "durata" :  duratelist }]
	

print "Content-Type: application/json \n\n"
print json.dumps(Dizionario)