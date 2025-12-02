import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { GenerateComponent } from './pages/generate/generate';
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'generate', component: GenerateComponent },
];
