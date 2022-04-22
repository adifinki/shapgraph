
  <style> body { margin: 0; } </style>

<!--   <script src="https://cdn.tryretool.com/js/react.production.min.js" crossorigin></script>
  <script src="https://cdn.tryretool.com/js/react-dom.production.min.js" crossorigin></script> -->

	<script src="https://unpkg.com/babel-standalone"></script>
 
  <script src="//unpkg.com/react/umd/react.production.min.js" crossorigin></script>
  <script src="//unpkg.com/react-dom/umd/react-dom.production.min.js" crossorigin></script>

	<script src="https://unpkg.com/@material-ui/core@3.9.3/umd/material-ui.production.min.js"></script>
  
  <script src="https://unpkg.com/3d-force-graph@1.70.9/dist/3d-force-graph.min.js"></script>
  <script src="https://unpkg.com/react-force-graph-3d"></script>

  <div id="graph"></div>

  <script type="text/babel">
    const { Dialog, DialogTitle, DialogContent, DialogContentText, Table, TableHead, TableBody, TableRow, TableCell } = window["material-ui"];

		const capitalizeFirstLetter = (string) => {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const Graph = ({triggerQuery, model, modelUpdate}) => {
      const getColor = (type, value) => {
        if (type === "times")
          return "pink"
        if (type === "plus")
          return "cyan"
        if (type === "input") {
          const max = model.max_shapely_value;
          const percent = Math.floor(value >= max ? 100 : (value/max * 100 + 35));
          const red = Math.floor(value >= max/2 ? 255 : value/max * 256.0);
          const green = Math.floor(value <= max/2 ? 255 : (max-value)/max * 256.0);
          return value === 0 ? "white" :`rgb(${red} ${green} 0 / ${percent}%)`;
        }
        return "white"
      }
      return (
        <div>
          <ForceGraph3D
            graphData={model.graph_data}
            nodeColor={(node) => getColor(node.type, node.shapley_value)}
            onNodeClick={(node, prevNode) => {
              modelUpdate({currentNode: {id: node.id, data: node.data, table_name: node.table_name, type: node.type, shapley_value: node.shapley_value}})
              console.log(node)
            }}
            nodeLabel={(node) => (node.type === "input" ? node.shapley_value : capitalizeFirstLetter(node.type))}
            // nodeVal={(node) => (node.type === "input" ? node.shapley_value : 1)}
          />
          <Dialog
            open={Boolean(model.currentNode)}
            onClose={() => modelUpdate({currentNode: null})}
            keepMounted
            aria-describedby="alert-dialog-slide-description"
          >
            {model.currentNode && (model.currentNode.type === "input" ? <div>
              <DialogTitle>{model.currentNode.table_name}</DialogTitle>
              <DialogContent>
                <DialogContentText id="dialog-description">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>key</TableCell>
                        <TableCell>value</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow key={-2}>
                        <TableCell component="th" scope="row">Node ID</TableCell>
                        <TableCell>{model.currentNode.id}</TableCell>
                      </TableRow>
                      <TableRow key={-1}>
                        <TableCell component="th" scope="row">Shapley Value</TableCell>
                        <TableCell>{model.currentNode.shapley_value}</TableCell>
                      </TableRow>
                      {Object.keys(model.currentNode.data).map((key, index) => (
                        <TableRow key={index}>
                          <TableCell component="th" scope="row">{key}</TableCell>
                          <TableCell>{model.currentNode.data[key]}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </DialogContentText>
              </DialogContent>
            </div> : <div>
             <DialogTitle>{capitalizeFirstLetter(model.currentNode.type)} type node</DialogTitle>
              <DialogContent>
                <DialogContentText id="type-dialog-description">
                  node id: {model.currentNode.id}
                </DialogContentText>
              </DialogContent>
           </div>)}
        	</Dialog>
        </div>
      );
    }
    
    const ConnectedComponent = Retool.connectReactComponent(Graph);
    
    ReactDOM.render(
      <ConnectedComponent/>,
      document.getElementById('graph')
    );
  </script>

          
