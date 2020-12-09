#!/usr/bin/python
# -*- coding: UTF-8 -*-
import json
import SPARQLWrapper
import rdflib
import cgi, cgitb 
form = cgi.FieldStorage() 
link = form.getvalue('link') 
#annotazioni riceve come parametro un elemento del tipo : http://annotaria.web.cs.unibo.it/documents/Example_ver1.html
#Per utilizzarlo nella query lo trasformiamo nel tipo: <http://vitali.web.cs.unibo.it/AnnOtaria/Example.html> (senza ver1_ e col prefix "ao:" )
linkver=link.split("documents/")[1]

#link=linkver.split("_ver1")[0] 
#link="<http://vitali.web.cs.unibo.it/AnnOtaria/" + link + ".html>"
linkver= "<http://vitali.web.cs.unibo.it/AnnOtaria/" + linkver + ">"

sparql = SPARQLWrapper.SPARQLWrapper("http://giovanna.cs.unibo.it:8181/data/query", returnFormat=SPARQLWrapper.JSON)
#Nella query facciamo ritornare :
#(?tipo = Il tipo di annotazione) (?ann = L'annotazione vera e propria) (?annotatore = Chi ha effettuato l'annotazione) (?dataann = Data dell'annotazione)
sparql.setQuery("""
PREFIX oa: <http://www.w3.org/ns/oa#> 
PREFIX ao: <http://vitali.web.cs.unibo.it/AnnOtaria/> 
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> 
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX  rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?tipo ?ann ?annotatore ?dataann ?nomevero
WHERE{ ?a 	a 	oa:Annotation ;
	           oa:hasBody 	?body ;
	           oa:annotatedBy 	?annotatoda ;
	           oa:annotatedAt 	?dataann  ;
	           oa:hasTarget """ +  linkver  + """;
	           ao:type ?tipo .
 		?body 	rdf:object ?ann .
 		?annotatoda foaf:name ?annotatore .
 		
		OPTIONAL { ?ann foaf:name ?nomevero .}
		OPTIONAL {  ?ann rdfs:label ?nomevero .} 
		OPTIONAL {  ?body rdfs:label ?nomevero .}  


 		 
 
}

ORDER BY DESC(?dataan)

""")

results = sparql.query().convert()
tipo = results['results']['bindings']
#dump = json.loads(results)
print "Content-Type: application/json\n\n"
print json.dumps(tipo)