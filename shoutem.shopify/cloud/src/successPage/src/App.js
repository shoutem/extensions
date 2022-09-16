import './App.css';
import Uri from 'urijs';
import { images } from './assets';

function App() {
  const query = new Uri(window.location.href).query();
  const parsedQuery = Uri.parseQuery(query);

  const isSuccess = parsedQuery?.success !== 'false';

  function handlePress() {
    window.open('https://builder.shoutem.com/app-creator/?alias=shopify&name=Shopify+app', '_blank');
  }

  const resolvedImage = isSuccess ? images.successState : images.errorState;
  const resolvedTitle = isSuccess ? "You're all set" : "Something went wrong";
  const resolvedDescription = isSuccess
    ? "Thank you for installing and connecting your Shopify account with Shoutem. You can now start selling your products via app."
    : "It looks like there might be an error and connection failed."

  return (
    <div className="App">
      <img src={resolvedImage} className="Status-image" alt='successImage'/>
      <text className="Title">{resolvedTitle}</text>
      <text className="Description">
        {resolvedDescription}
      </text>
      {isSuccess && (
        <>
          <div className='Button' onClick={handlePress}>
            <text className='Button-text'>
              CONTINUE
            </text>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
