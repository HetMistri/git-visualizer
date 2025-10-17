import { GitGraph } from '../core/gitGraph'
import './App.css'

function App() {

  const graph = new GitGraph();
  console.log("Initial State: ", graph);

  graph.commit("feat: Add user login functionality");
  graph.commit("fix: Correct password validation bug");
  console.log("After two commits:", graph);

  graph.createBranch("develop");
  console.log("After creating 'develop' branch:", graph);

  graph.checkout("develop");
  console.log("After checking out 'develop': ", graph);
  
  graph.commit("feat: Implement new feature on develop");
  console.log("After committing on 'develop':", graph);

  return (

      <>
      </>
      
    
  )
}

export default App
