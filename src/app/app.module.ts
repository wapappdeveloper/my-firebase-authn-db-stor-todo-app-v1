import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { ROUTING } from './app.routing';

import { AppComponent } from './app.component';
import { SigninComponent } from "./components/signin/signin.component";
import { InfoComponent } from './components/info/info.component';
import { SignupComponent } from "./components/signup/signup.component";
import { SignoutComponent } from './components/signout/signout.component';
import { MainComponent } from './components/main/main.component';
import { HeaderComponent } from './components/header/header.component';
import { SignupSuccessComponent } from './components/signup-success/signup-success.component';
import { SectionComponent } from './components/section/section.component';
import { LogoComponent } from './components/logo/logo.component';
import { ProfileComponent } from './components/profile/profile.component';

import { AuthnService } from './services/authn.service';
import { InteractService } from './services/interact.service';
import { CommonService } from './services/common.service';
import { DataPersistenceService } from './services/data-persistence.service';
import { GlobalService } from './services/global.service';
import { DatabaseService } from './services/database.service';
import { StorageService } from './services/storage.service';
import { PageAuthorizationGuard } from './page-authorization.guard';

import { CONFIG } from './config';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { DeleteAccountComponent } from './components/delete-account/delete-account.component';
import { DeleteSuccessComponent } from './components/delete-success/delete-success.component';
import { LoaderComponent } from './components/loader/loader.component';
import { TodoComponent } from './components/todo/todo.component';

@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    InfoComponent,
    SignupComponent,
    SignoutComponent,
    MainComponent,
    HeaderComponent,
    SignupSuccessComponent,
    SectionComponent,
    LogoComponent,
    ProfileComponent,
    DeleteAccountComponent,
    DeleteSuccessComponent,
    LoaderComponent,
    TodoComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ROUTING,
    HttpClientModule,
    AngularFireModule.initializeApp(CONFIG.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule
  ],
  providers: [AuthnService, InteractService, CommonService, DataPersistenceService, PageAuthorizationGuard, GlobalService, DatabaseService, StorageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
