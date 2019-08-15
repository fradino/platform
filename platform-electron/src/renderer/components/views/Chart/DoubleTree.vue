<template>
  <Pane>
    <div id="myDiagramDiv" style="width: 100%; height: 100%"></div>

  </Pane>


</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import go from 'gojs'
  import Pane from '../../layout/Pane'

  var GO;
  var myDiagram;
  var rootKey = 'Root';
  export default {
    name: 'DoubleTree',

    data() {
      return {
      }
    },

    components: {
      Pane,
    },
    computed: {
      ...mapState([
        "chart_data"
      ]),
    },

    methods: {
      ...mapActions([
        'request',
      ]),
      expendAll: function () {
        var n = myDiagram.nodes
        n.each(function (e,i) {
          e.expandTree()
        })
      },

      collapseAll: function() {
        var n = myDiagram.nodes
        n.each(function (e,i) {
          e.collapseTree()
        })
      }
    },

    mounted() {
      GO = go.GraphObject.make;  // for conciseness in defining templates in this function
      myDiagram = GO(go.Diagram, "myDiagramDiv", {
        allowMove: false,
      });

      // define all of the gradient brushes
      var graygrad = GO(go.Brush, "Linear", {0: "#F5F5F5", 1: "#F1F1F1"});
      var bluegrad = GO(go.Brush, "Linear", {0: "#CDDAF0", 1: "#91ADDD"});
      var yellowgrad = GO(go.Brush, "Linear", {0: "#FEC901", 1: "#FEA200"});
      var lavgrad = GO(go.Brush, "Linear", {0: "#EF9EFA", 1: "#A570AD"});

      const that=this
      // define the Node template for non-terminal nodes
      myDiagram.nodeTemplate =
        GO(go.Node, "Horizontal",
          {
            doubleClick: function (a, c) {

              if (c.data.key==='外形照片') {
                that.$openImage(c.data.url)
              }
              c = c.part;
              var b = c.diagram;
              if (null !== b) {
                b = b.commandHandler;
                if (c.isTreeExpanded) {
                  if (!b.canCollapseTree(c)) return
                } else if (!b.canExpandTree(c)) return;
                a.handled = !0;
                c.isTreeExpanded ? b.collapseTree(c) : b.expandTree(c)
              }
            },
          },
          GO(go.Panel, 'Auto',
            // define the node's outer shape
            GO(go.Shape, "RoundedRectangle",
              {fill: graygrad, stroke: "#D8D8D8"},
              new go.Binding("fill", "c", function (f) {
                if (f==='lav')
                  return lavgrad;
                else if (f==='yellow')
                  return yellowgrad;
                else if (f==='blue')
                  return bluegrad;
                else
                  return graygrad;
              })),
            // define the node's text
            GO(go.TextBlock,
              {margin: 5, font: " 11px Helvetica, bold Arial, sans-serif"},
              new go.Binding("text", "key"))),
          GO(go.Picture,
            {margin: 10, width: 50, height: 50, background: "#44CCFF"},
            new go.Binding("source", "url",function (f) {
              if (f==='None')
                return ''
              else
                return f
            }),
            new go.Binding("visible", "url", function (f) {
              return f !== "None";
            })
          )
        );


      myDiagram.nodeTemplate.contextMenu =
        GO("ContextMenu",
          GO("ContextMenuButton",
            GO(go.TextBlock, "Shift Left"),
            { click: function(e, obj) { shiftNode(obj, -20); } }),
          GO("ContextMenuButton",
            GO(go.TextBlock, "Shift Right"),
            { click: function(e, obj) { shiftNode(obj, +20); } })
        );

      function shiftNode(obj, dist) {
        var adorn = obj.part;
        var node = adorn.adornedPart;
        node.diagram.commit(function(d) {
          var pos = node.location.copy();
          pos.x += dist;
          node.location = pos;
        }, "Shift");
      }
      // define the Link template
      myDiagram.linkTemplate =
        GO(go.Link,  // the whole link panel
          {selectable: false},
          GO(go.Shape));  // the link shape

      // create the model for the double tree
      myDiagram.model = new go.TreeModel();

      doubleTreeLayout(myDiagram);
    },

    watch: {
      chart_data: function (cd) { //li就是改变后的wifiList值
        rootKey=cd[0].key;
        myDiagram.model = new go.TreeModel(cd);
        doubleTreeLayout(myDiagram);
        for (var i = 0; i < cd.length; i++) {
          if (cd[i].layer === 3 || cd[i].layer === -2) {
            var b = myDiagram.findNodeForKey(cd[i].key);
            b.collapseTree();
          }
        }
      },
    },
  }

  function doubleTreeLayout(diagram) {
    // Within this function override the definition of 'GO' from jQuery:
    var GO = go.GraphObject.make;  // for conciseness in defining templates
    diagram.startTransaction("Double Tree Layout");

    // split the nodes and links into two Sets, depending on direction
    var leftParts = new go.Set(/*go.Part*/);
    var rightParts = new go.Set(/*go.Part*/);
    separatePartsByLayout(diagram, leftParts, rightParts);
    // but the ROOT node will be in both collections

    // create and perform two TreeLayouts, one in each direction,
    // without moving the ROOT node, on the different subsets of nodes and links
    var layout1 =
      GO(go.TreeLayout,
        {
          angle: 180,
          arrangement: go.TreeLayout.ArrangementFixedRoots,
          setsPortSpot: false
        });

    var layout2 =
      GO(go.TreeLayout,
        {
          angle: 0,
          arrangement: go.TreeLayout.ArrangementFixedRoots,
          setsPortSpot: false
        });

    layout1.doLayout(leftParts);
    layout2.doLayout(rightParts);

    diagram.commitTransaction("Double Tree Layout");
  }

  function separatePartsByLayout(diagram, leftParts, rightParts) {
    var root = diagram.findNodeForKey(rootKey);
    if (root === null) return;
    // the ROOT node is shared by both subtrees!
    leftParts.add(root);
    rightParts.add(root);
    // look at all of the immediate children of the ROOT node
    root.findTreeChildrenNodes().each(function (child) {
      // in what direction is this child growing?
      var dir = child.data.dir;
      var coll = (dir === "left") ? leftParts : rightParts;
      // add the whole subtree starting with this child node
      coll.addAll(child.findTreeParts());
      // and also add the link from the ROOT node to this child node
      coll.add(child.findTreeParentLink());
    });
  }
</script>

<style>

</style>
