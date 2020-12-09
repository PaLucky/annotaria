#!/usr/bin/python
# -*- coding: UTF-8 -*-
import json
import SPARQLWrapper
import rdflib
import cgi, cgitb 
form = cgi.FieldStorage() 
dbpedia = form.getvalue('link') 
dbpedia = "<" + dbpedia + ">"


sparql = SPARQLWrapper.SPARQLWrapper("http://dbpedia.org/sparql", returnFormat=SPARQLWrapper.JSON)
#Nella query facciamo ritornare :
#(?tipo = Il tipo di annotazione) (?ann = L'annotazione vera e propria) (?annotatore = Chi ha effettuato l'annotazione) (?dataann = Data dell'annotazione)
sparql.setQuery("""
PREFIX dbpedia-owl: <http://dbpedia.org/ontology/>

SELECT ?contenuto ?img
WHERE { 
  """ + dbpedia + """ dbpedia-owl:abstract ?contenuto.

  OPTIONAL {""" + dbpedia + """ dbpedia-owl:thumbnail ?img.}
 FILTER (langMatches(lang(?contenuto),"en"))
}
""")

results = sparql.query().convert()
tipo = results['results']['bindings']
#dump = json.loads(results)
print "Content-Type: application/json\n\n"
print json.dumps(tipo)