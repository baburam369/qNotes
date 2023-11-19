import Notes from "./Notes";

const Home = (props) => {
  const {showAlert} = props;
  const token = localStorage.getItem('token');
  console.log('Token:', token);
  return (
    <div className="container">
   
      {/* Notes component render here */}
      <Notes showAlert={showAlert}/>
     
    </div>
  );
}
export default Home;