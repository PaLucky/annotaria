#!/usr/bin/python
# -*- coding: UTF-8 -*-

import urllib2
import json
import threading
from HTMLParser import HTMLParser
from bs4 import BeautifulSoup
import time
#count=0
urldoc='http://annotaria.web.cs.unibo.it/documents/'
sub= 'html'
Dizionario=[]
threads = []
#Dizionario= [{"link":"1", "titolo":"questoèuntitolo"}]
html = urllib2.urlopen(urldoc)
soup = BeautifulSoup(html)
tag=soup.find_all('a')
def Scrape(link):# Analizzo la pagina del documento specifico e ne cerco il titolo
	global Dizionario
	html2=urllib2.urlopen(urldoc + link)
	soup2=BeautifulSoup(html2)  	
	tag2=soup2.find("h1",attrs={"class": "document-title"})
	Dizionario+=[{"link":  urldoc + child  , "titolo":  tag2.get_text() + "<hr width=100% size=2 color=FFFFFF>" }]
	html.close()
for i in tag:
	if i.string.find(sub)>0: ## Seleziono quelli che terminano .html che ci interessano
		for child in i.children:
			t = threading.Thread(target=Scrape,args=(child.string,))
			t.start()
    		threads.append(t)
# join all threads
for t in threads:
    t.join()
html.close()
print "Content-Type: application/json\n\n"
print json.dumps(Dizionario)
#print (time.clock())
			 
