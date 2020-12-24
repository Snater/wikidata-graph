const forward = `wd:<%- item %> wdt:<%- property %>* ?item`;

const reverse = `?item wdt:<%- property %>* wd:<%- item %>`;

const both = `{ <%- clauses.forward %> } UNION { <%- clauses.reverse %> }`;

const gas = `SERVICE gas:service {
  gas:program gas:gasClass "com.bigdata.rdf.graph.analytics.SSSP";
  gas:in wd:<%- item %>;
  gas:traversalDirection "<%- mode %>";
  gas:out ?item;
  gas:out1 ?depth;<% if (iterations > 0) { %>
  gas:maxIterations <%- iterations %>;<% } %><% if (limit > 0) { %>
  gas:maxVisited <%- limit %>;<% } %>
  gas:linkType wdt:<%- property %>.
}`;

export {
	forward,
	reverse,
	both,
	gas
};
