/**
 * CS-5356-TODO
 * Create a question for a class session
 *
 * A user can provide the content of their question,
 * and their name. When they submit the form, make a
 * POST /api/class-session/:session-code/question
 * with the value of their inputs in the body of
 * the request.
 *
 * If it is successful, call `props.onQuestionCreated()`
 * to tell the parent component to refresh the view
 */
const CreateQuestion = props => {
  const handleSubmit = e => {
    e.preventDefault();
    console.log("[CS5356] on create question form submitted");

    const { sessionCode } = props;
    fetch(`api/class-session/${sessionCode}/question`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: e.target.username.value, question: e.target.question.value })
    }).then(response => {
      if (response.ok) {
        props.onQuestionCreated()
      } else {
        console.log('Cannot create questions')
      }
    })
  };
  return (
    <>
      <div className="has-text-centered">
        <h1 className="title">Ask a Question</h1>
      </div>
      <form
        className="is-flex is-flex-direction-column is-align-items-center"
        onSubmit={handleSubmit}
      >
        <div className="field" style={{ width: "50%" }}>
          <label className="label" htmlFor="question">
            Type your question
          </label>
          <div className="control">
          <input name="question" className="input"/> 
          </div>
        </div>
        <div className="field" style={{ width: "50%" }}>
          <label className="label" htmlFor="name">
            Name (optional)
          </label>
          <input name="username" className="input"/> 
        </div>

        <div className="field">
          <div className="control">
            <input type="submit" className="button is-primary"/>
          </div>
        </div>
      </form>
    </>
  );
};

export default CreateQuestion;
