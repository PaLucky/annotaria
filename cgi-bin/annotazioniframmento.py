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
PREFIX skos: <http://www.w3.org/2004/02/skos/core#> 
PREFIX rdfs:  <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?ann ?annotatore ?dataann ?tipo ?fstart ?divid ?fend ?nomevero ?framunivoco ?linkdbp ?cites

WHERE{ 
?root a  oa:Annotation ;
	oa:hasBody  ?annot ;
	oa:hasTarget ?fram ;
	oa:annotatedBy 	?annotatoda ;
	oa:annotatedAt 	?dataann  ; 
	ao:type ?tipo .
?annot a rdf:Statement ;
	rdf:subject ?framunivoco;
	rdf:object ?ann .
?fram a oa:SpecificResource;
	oa:hasSelector ?pez ;
	oa:hasSource """ + linkver + """ .
?pez a oa:FragmentSelector ;
	oa:end  ?fend ;
	oa:start  ?fstart ;
	rdf:value  ?divid .
?annotatoda foaf:name ?annotatore .

OPTIONAL { ?ann foaf:name ?nomevero .}

OPTIONAL {  ?ann rdfs:label ?nomevero .}

OPTIONAL {?annot rdf:resource ?linkdbp . }

OPTIONAL {?annot rdfs:label ?cites . }

}

""")

results = sparql.query().convert()
tipo = results['results']['bindings']
#dump = json.loads(results)
print "Content-Type: application/json\n\n"
print json.dumps(tipo)
