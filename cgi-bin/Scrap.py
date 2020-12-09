#!/usr/bin/python
# -*- coding: UTF-8 -*-

import urllib2
from bs4 import BeautifulSoup
import cgi, cgitb 
import json
Dizionario=[]
Diz=[]
Daz={}
form = cgi.FieldStorage() 
c=0
f=0
e=0
#link = form.getvalue('link') 
link='http://www.discogs.com/artist/668917-Maztek?filter_anv=0&type=Releases&page=2'
hdr = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11',
       'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
       'Accept-Charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.3',
       'Accept-Encoding': 'none',
       'Accept-Language': 'en-US,en;q=0.8',
       'Connection': 'keep-alive'}
req = urllib2.Request(link,headers=hdr)
html = urllib2.urlopen(req)
soup = BeautifulSoup(html)

tag = soup.find_all("td",attrs={"class": "title"})


for i in tag:
	for d in i.find_all("a",recursive=False):
		#print d['href']   == i link delle release
		#Dizionario+=[{ "tit" :  d.string }]
		Dizionario.append (d.string)



tag = soup.find_all("td",attrs={"class": "year has_header"})

for i in tag:
	c=c+1
	#Diz.append({Dizionario[c-1]:{ "anno" :  i.next }})
	Daz[Dizionario[c-1]]={ "anno" :  i.next }
	#Daz[Dizionario[c-1]]["anno"] =  i.next

	
tag = soup.find_all("td",attrs={"class": "catno_first"})

for i in tag:
	e=e+1
	#Diz.append({Dizionario[e-1]:{ "cat" :  i.next.next }})
	Daz[Dizionario[e-1]]["cat"] =  i.next.next 




tag = soup.find_all("td",attrs={"class": "label has_header"})

for i in tag:
	f=f+1
	#Dizionario+=[{ "lab" :  i.next.next }]
	
	
	remove_list = ["(2)","(3)","(4)","(5)","(6)","(7)","(8)","(9)"]
	prova=i.next.next
	word_list = prova.split()

	out=' '.join([t for t in word_list if t not in remove_list])
	
	
	#prova=i.next.next
	#regex = re.compile(r'\b('+remove+r')\b', flags=re.IGNORECASE)
	#out = regex.sub("", prova)
	#print out
	Daz[Dizionario[f-1]]["lab"] =  out
	#Daz[Dizionario[f-1]]["lab"] =  i.next.next





print "Content-Type: application/json \n\n"
print json.dumps((Daz) , indent=2)

#for key,val in Daz.items():
 #   print key, "=>", val