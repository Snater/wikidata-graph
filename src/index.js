import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

const query = `SELECT ?item ?itemLabel ?linkTo {
  SERVICE gas:service {
    gas:program gas:gasClass "com.bigdata.rdf.graph.analytics.SSSP" ;
    gas:in wd:Q4450926 ;
    gas:traversalDirection "Forward" ;
    gas:out ?item ;
    gas:out1 ?depth ;
    gas:maxIterations 4 ;
    gas:linkType wdt:P40 .
  }
  OPTIONAL { ?item wdt:P40 ?linkTo }
  SERVICE wikibase:label {bd:serviceParam wikibase:language "en" }
}`;

ReactDOM.render(<App defaultQuery={query} />, document.getElementById('root'));
