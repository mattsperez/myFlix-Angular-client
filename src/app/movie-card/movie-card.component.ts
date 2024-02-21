// src/app/movie-card/movie-card.component.ts
import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GenreComponent } from '../genre/genre.component';
import { DirectorComponent } from '../director/director.component';
import { DescriptionComponent } from '../description/description.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent {
  movies: any[] = [];
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

  openGenre(genre: any[]): void {
    this.dialog.open(GenreComponent, {
      data: {
        Genre: genre,
      },
    });
  }

  openDirector(director: any): void {
    this.dialog.open(DirectorComponent, {
      data: {
        Name: director.Name,
        Birth: director.Birth,
        Bio: director.Bio,
      },
    });
  }

  openDescription(description: string): void {
    this.dialog.open(DescriptionComponent, {
      data: {
        Description: description,
      },
    });
  }

  // Function to add/remove movie to/from favorites
  toggleFavorite(movie: any): void {
    // Toggle the favorite status of the movie
    if (this.isMovieFavorite(movie)) {
      // Remove the movie from favorites locally
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.FavoriteMovies = user.FavoriteMovies.filter(
        (id: string) => id !== movie._id
      );
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      // Add the movie to favorites locally
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.FavoriteMovie.push(movie._id);
      localStorage.setItem('user', JSON.stringify(user));

      // Add the movie to favorites on the backend server
      this.fetchApiData.addFavoriteMovie(movie._id).subscribe(
        () => {
          console.log('Movie added to favorites successfully.');
        },
        (error) => {
          console.error('Error adding movie to favorites:', error);
        }
      );
    }

    // Update the local 'isFavorite' property to reflect the change
    movie.isFavorite = !this.isMovieFavorite(movie);
  }

  // Function to check if a movie is in favorites
  isMovieFavorite(movie: any): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.FavoriteMovies && user.FavoriteMovies.includes(movie._id);
  }
}
