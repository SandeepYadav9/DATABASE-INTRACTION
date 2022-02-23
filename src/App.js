import React, { useState } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";
import AddMovies from "./components/AddMovies";
import Movie from "./components/Movie";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMoviesData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchData = await fetch(
        "https://steady-observer-301416-default-rtdb.firebaseio.com/movies.json"
      );
      if (!fetchData.ok) {
        throw new Error("Something Went Wrong ");
      }
      const data = await fetchData.json();
      console.log(data);
      const loadMovies = [];
      for (let key in data) {
        loadMovies.push({
          id: key,
          title: data[key].title,
        });
      }
      // setMovies(
      //   data.results.map((result) => {
      //     return {
      //       key: result.episode_id,
      //       title: result.title,
      //       openingText: result.producer,
      //     };
      //   })
      // );
      setMovies(loadMovies)
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  };

  const onAddMoviesHandler = async (movie) => {
    const fetchDataToStorOnDataBase = await fetch(
      "https://steady-observer-301416-default-rtdb.firebaseio.com/movies.json",
      {
        method: "POST",
        body: JSON.stringify(movie),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await fetchDataToStorOnDataBase.json();
    console.log(data);
  };
  return (
    <React.Fragment>
      <section>
        <AddMovies onAddMovie={onAddMoviesHandler} />
      </section>

      <section>
        <button onClick={fetchMoviesData}>Fetch Movies</button>
      </section>
      <section>
        {!isLoading && movies.length > 0 && <MoviesList movies={movies} />}
        {!isLoading && movies.length === 0 && !error && <p>Not Found Data</p>}
        {isLoading && !error && <p>Loading...</p>}
        {!isLoading && error && <p>{error}</p>}
      </section>
    </React.Fragment>
  );
}

export default App;
