// WHAT? create a new copy of object with correct properties in case properties don't match.
// INPUT in the data object variable name, Node Property Name, and Child Property Name
// WHY? This is to allow flexibility in naming the properties in the data structure
function formatObject(tree, name, children) {

  var result = {};

  function traverse(original, copy){
    copy.name = original[name];
    if(Array.isArray(original[children])){
      copy.children = [];
      for(var i = 0; i < original[children].length; i++){
        copy.children[i] = {}
        traverse(original[children][i], copy.children[i])
      }
    }
  }

  traverse(tree, result);

  return result;

};

// This class design pattern is functional style. I chose this because it allows for private variables. It is really clear and easy to use for D3. If I had chosen the pseudoclassical style there I would have had to use 'this' a lot - and in this case - would get messy, and hard to read.

function TreeView() {

  // Declare empty Object to Return
  var self = {};

  // Private Variables and d3 Setup
  var margin = {top: 20, right: 120, bottom: 20, left: 120},
      width = 960 - margin.right - margin.left,
      height = 800 - margin.top - margin.bottom;

  var svg = d3.select(".container").append("svg")
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var tree = d3.layout.tree()
      .size([height, width]);

  var i = 0,
      duration = 750,
      root;

  var diagonal = d3.svg.diagonal()
      .projection(function(d) { return [d.y, d.x]; });

  d3.select(self.frameElement).style("height", "800px");

  // methods attached to self object
  self.setData = function(d, name, children) {
      return data = formatObject(d, name, children);
  };
  self.getData = function() {
      return data;
  };

  // To Draw the Tree
  self.update = function(source) {

    // Compute the new tree layout.
    var nodes = tree.nodes(self.getData()).reverse(),
        links = tree.links(nodes);

    // Normalize for fixed-depth.
    nodes.forEach(function(d) { d.y = d.depth * 180; });

    // Update the nodes…
    var node = svg.selectAll("g.node")
        .data(nodes, function(d) { return d.id || (d.id = ++i); });

    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
        .on("click", self.click);

    nodeEnter.append("circle")
        .attr("r", 1e-6)
        .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

    nodeEnter.append("text")
        .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
        .attr("dy", ".35em")
        .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
        .text(function(d) { return d.name; })
        .style("fill-opacity", 1e-6);

    // Transition nodes to their new position.
    var nodeUpdate = node.transition()
        .duration(duration)
        .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

    nodeUpdate.select("circle")
        .attr("r", 4.5)
        .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

    nodeUpdate.select("text")
        .style("fill-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    var nodeExit = node.exit().transition()
        .duration(duration)
        .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
        .remove();

    nodeExit.select("circle")
        .attr("r", 1e-6);

    nodeExit.select("text")
        .style("fill-opacity", 1e-6);

    // Update the links…
    var link = svg.selectAll("path.link")
        .data(links, function(d) { return d.target.id; });

    // Enter any new links at the parent's previous position.
    link.enter().insert("path", "g")
        .attr("class", "link")
        .attr("d", function(d) {
          var o = {x: source.x0, y: source.y0};
          return diagonal({source: o, target: o});
        });

    // Transition links to their new position.
    link.transition()
        .duration(duration)
        .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
        .duration(duration)
        .attr("d", function(d) {
          var o = {x: source.x, y: source.y};
          return diagonal({source: o, target: o});
        })
        .remove();

    // Stash the old positions for transition.
    nodes.forEach(function(d) {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  };

  // Toggle children on click.
  self.click = function(d) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    self.update(d);
  };

  // render Tree
  self.render = function() {
    data.x0 = height / 2;
    data.y0 = 0;
    self.update(self.getData());
  };

//return object
  return self;

}

//-------------------------------------------
// API INTERFACE - input data structure here in items
var items = {
    label: 'Node Label',
    items: [
        {
            label: 'Child Node Label',
            items: [
                {
                    label: 'Child Node Label',
                    items: [
                        {
                            label: 'Child Node Label',
                            items: [

                            ]
                        },
                        {
                            label: 'Child Node Label',
                        },
                        {
                            label: 'Leaf Node Label'
                        }
                    ]
                }
            ]
        },
        {
            label: 'Leaf Node Label'
        }
    ]
};
//-------------------------------------------

// instantiating and rendering TreeView
treeSVG = TreeView();
treeSVG.setData(items, 'label', 'items');
treeSVG.render();


// User-Friendly API
// To input data structures straight through the DOM textarea (for developer testing only)
// eval() is dangerous to use because of possible cross-injection attacks
$(document).ready(function() {

  $('.data button').on("click",function(event) {
    event.preventDefault();
    var data = $('textarea').val();
    parsedData = eval("(" + data + ")");
    treeSVG.setData(parsedData, 'name', 'children');
    treeSVG.render();
  });

});