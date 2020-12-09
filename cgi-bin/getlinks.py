#!/usr/bin/python
# -*- coding: UTF-8 -*-

import urllib
import json
from bs4 import BeautifulSoup
#count=0
urldoc='http://annotaria.web.cs.unibo.it/documents/'
sub= 'html'
Dizionario=[]
#Dizionario= [{"link":"1", "titolo":"questoèuntitolo"}]
html = urllib.urlopen(urldoc)
soup = BeautifulSoup(html)
tag=soup.find_all('a')
for i in tag:
	if i.string.find(sub)>0: ## Seleziono quelli che terminano .html che ci interessano
		for child in i.children:
			Dizionario+=[{"linkss":  urldoc + child}]
			
print "Content-Type: application/json\n\n"
print json.dumps(Dizionario)