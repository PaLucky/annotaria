#!/usr/bin/python
# -*- coding: UTF-8 -*-

import urllib
from bs4 import BeautifulSoup
import cgi, cgitb 
import json
Dizionario=[]
form = cgi.FieldStorage() 
link = form.getvalue('link') 
html = urllib.urlopen(link)
soup = BeautifulSoup(html)

tag = soup.find("h1",attrs={"class": "document-title"})
Dizionario = [{"titolo":  tag.get_text() }]

print "Content-Type: application/json \n\n"
print json.dumps(Dizionario)