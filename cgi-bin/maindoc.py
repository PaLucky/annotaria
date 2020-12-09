#!/usr/bin/python
# -*- coding: UTF-8 -*-

import urllib
from HTMLParser import HTMLParser
from bs4 import BeautifulSoup
import cgi, cgitb 
form = cgi.FieldStorage() 
link = form.getvalue('link') 
html = urllib.urlopen(link)
soup = BeautifulSoup(html)

tag1 = soup.find("h1",attrs={"class": "document-title"})
tag = soup.find("div",attrs={"class": "body"})
tag2 = soup.find("div",attrs={"class": "back"})


print "Content-Type: text/html"
print """
<div id=documento>"""
print tag1
print tag
print tag2
print"""
</div>
"""

