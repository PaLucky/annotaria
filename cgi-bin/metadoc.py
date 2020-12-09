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


tag = soup.find("div", attrs={ "class":"front"})
tag2 = soup.find("div", attrs={ "class":"footer"})


print "Content-Type: text/html"
print """
<div id=metadati>"""
print tag
print tag2
print"""
</div>
"""
