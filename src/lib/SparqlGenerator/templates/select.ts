const select = `<% if (useGAS) { %>PREFIX gas: <http://www.bigdata.com/rdf/gas#>
<% } %>SELECT ?item ?itemLabel ?linkTo <% if (sizeProperty) { %>?size <% } %>{
<% if (sizeProperty) { -%>
{ SELECT ?item (count(distinct ?element) as ?size) {
<%- clause %>
OPTIONAL { ?element wdt:<%- sizeProperty %> ?item }
} GROUP BY ?item }
<% } else { -%>
<%- clause %>
<% } -%>
OPTIONAL { ?item wdt:<%- property %> ?linkTo }
SERVICE wikibase:label {bd:serviceParam wikibase:language "<%- language %>" }
}`;

export default select;