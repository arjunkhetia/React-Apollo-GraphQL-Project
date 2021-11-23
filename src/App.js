import React, { useState } from "react";
import "./App.css";
import { gql, useQuery, useMutation, useSubscription, NetworkStatus, useLazyQuery } from "@apollo/client";

const QUERY = gql`
  query GetAllUsers {
    getAllUsers {
      id
      first_name
      last_name
      email
      gender
    }
  }
`;

const GET_USER = gql`
  query GetUser($id: Int) {
    getUser(id: $id) {
      id
      first_name
      last_name
      email
      gender
    }
  }
`;

const MUTATION = gql`
  mutation CreateUser($firstName: String, $lastName: String, $email: String, $gender: String) {
    createUser(first_name: $firstName, last_name: $lastName, email: $email, gender: $gender) {
      id
      first_name
      last_name
      email
      gender
    }
  }
`;

const SUBSCRIPTION = gql`
  subscription Subscription {
    newUser {
      id
      first_name
      last_name
      email
      gender
    }
  }
`;

function App() {
  const { loading, error, data, refetch, networkStatus } = useQuery(QUERY, {
    notifyOnNetworkStatusChange: true,
    // pollInterval: 500,  // query to execute periodically at a specified interval
  });
  const [getUser, { loading: lazyloading, error: lazyerror, data: lazydata }] = useLazyQuery(GET_USER);
  const [createUser, { data: mutationdata, loading: mutationloading, error: mutationerror }] = useMutation(MUTATION);
  const { data: subscriptiondata, loading: subscriptionloading } = useSubscription(SUBSCRIPTION);
  const [id, setId] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  if (networkStatus === NetworkStatus.refetch) return 'Refetching!';
  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;
  if (lazyloading) return <p>Loading ...</p>;
  if (lazyerror) return `Error! ${lazyerror.message}`;
  if (mutationloading) return <p>Submitting...</p>;
  if (mutationerror) return `Error! ${mutationerror.message}`;
  return (
    <div className="App">
      <div>
        <br /><br />
        First Name: <input type="text" name="first_name" value={first_name} onChange={(event) => setFirstName(event.target.value)}></input>
        <br /><br />
        Last Name: <input type="text" name="last_name" value={last_name} onChange={(event) => setLastName(event.target.value)}></input>
        <br /><br />
        Email: <input type="text" name="email" value={email} onChange={(event) => setEmail(event.target.value)}></input>
        <br /><br />
        Gender: <input type="text" name="gender" value={gender} onChange={(event) => setGender(event.target.value)}></input>
        <br /><br />
        <button onClick={() => {
          createUser({ 
          variables: { 
            firstName: first_name,
            lastName: last_name,
            email: email,
            gender: gender
          } 
        });
        setFirstName('');
        setLastName('');
        setEmail('');
        setGender('');
        refetch();
        console.log(mutationdata);
        }}>Add User</button>
      </div>
      <div>
      <h4>Subscription Data: {!subscriptionloading && JSON.stringify(subscriptiondata?.newUser)}</h4>
      </div>
      <table className="usertable">
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Gender</th>
          </tr>
        </thead>
        <tbody>
          {data.getAllUsers.map((user) => {
            return (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.first_name}</td>
                <td>{user.last_name}</td>
                <td>{user.email}</td>
                <td>{user.gender}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <br />
      <button onClick={() => refetch()}>Refresh</button>
      <br /><br />
      <div>
        <label>User ID </label>
        <input type="text" value={id} onChange={(event) => setId(event.target.value)}></input>
        <br /><br />
        <button onClick={() => getUser({ variables: { id: parseInt(id) } })}>Submit</button>
        <br /><br />
        User Data : {lazydata?.getUser && <p>{JSON.stringify(lazydata.getUser)}</p>}
        <br />
      </div>
    </div>
  );
}

export default App;
