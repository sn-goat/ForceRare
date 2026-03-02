import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home';
import { NotreHistoireComponent } from './pages/notre-histoire/notre-histoire';
import { NotreMissionComponent } from './pages/notre-mission/notre-mission';
import { NotreEquipeComponent } from './pages/notre-equipe/notre-equipe';
import { NosPartenairesComponent } from './pages/nos-partenaires/nos-partenaires';
import { CollaborerComponent } from './pages/collaborer/collaborer';
import { NousJoindreComponent } from './pages/nous-joindre/nous-joindre';
import { FaireUnDonComponent } from './pages/faire-un-don/faire-un-don';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'notre-histoire', component: NotreHistoireComponent },
  { path: 'notre-mission', component: NotreMissionComponent },
  { path: 'notre-equipe', component: NotreEquipeComponent },
  { path: 'nos-partenaires', component: NosPartenairesComponent },
  { path: 'collaborer', component: CollaborerComponent },
  { path: 'nous-joindre', component: NousJoindreComponent },
  { path: 'faire-un-don', component: FaireUnDonComponent },
  { path: '**', redirectTo: '' },
];
