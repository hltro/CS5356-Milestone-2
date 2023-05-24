/**
 * CS-5356-TODO
 * Logged in users can click a button to generate a new
 * session code.
 *
 * When a user clicks the button, send a request to
 * POST /api/class/:classId/session-code. If it returns
 * successfully, call the `props.onCodeGenerated` callback
 * to tell the parent component to refresh the view
 */
const GenerateNewCode = props => {
  const {classId, } = props;

  const onGenerate = () =>{
    fetch(`api/class/${classId}/session-code`, {
      method: 'POST',
    }).then(response => {
      if (response.ok) {
        props.onCodeGenerated()
      } else {
        console.log('Cannot create session code')
      }
    })
  }
  
  return (
    <div className="mt-5">
      <button className="button" onClick={onGenerate}>Generate New Code</button>
    </div>
  );
};

export default GenerateNewCode;
