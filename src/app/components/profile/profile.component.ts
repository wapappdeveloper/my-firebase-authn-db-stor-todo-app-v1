import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { GlobalService } from '../../services/global.service';
import { DatabaseService } from '../../services/database.service';
import { StorageService } from '../../services/storage.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CONFIG } from '../../config';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  data: any = {};
  params: any = {
    header: 'profile',
    page: 'profile'
  }
  page_1: boolean = true;
  page_2: boolean = false;
  error: any = {
    profileImagePathIsError: false,
    profileImagePathAlert: 'some error',
    profileNameIsError: false,
    profileNameAlert: 'some error',
    birthdayIsError: false,
    birthdayAlert: 'some error',
    genderIsError: false,
    genderAlert: 'some error'
  };
  dataModified: boolean = false;
  selectedFile: any;
  loading:boolean = false;
  profileImageLoading:boolean = false;

  constructor(private commonService: CommonService, private globalService: GlobalService, private databaseService: DatabaseService, private storageService: StorageService, private sanitization:DomSanitizer) { }

  ngOnInit() {
    this.data = this.globalService.data;
    this.databaseService.getDataByUID(this.globalService.data.uid, 'userDetail').then((res) => {
      if (res) {
        this.data.userDetail = res;
        this.page_1 = false;
        this.page_2 = true;
      }
    });
    this.dataModified = false;
  }

  sanitizeStyleURL(url:string){
    if(url===''){
      return '';
    }else{
      return this.sanitization.bypassSecurityTrustStyle(`url(${url})`);
    }
  }

  dataChanged() {
    this.dataModified = true;
  }

  onChange(event: any) {
    this.profileImageLoading = true;
    this.selectedFile = event.target.files[0];
    this.storageService.uploadFileByUID(this.globalService.data.uid, CONFIG.application.profilePictureName, this.selectedFile).subscribe((res) => {
      if(res.downloadURL){
        this.loading = true;
        setTimeout(()=>{
          this.profileImageLoading = false;
        },2400);
      }
      this.data.userDetail.profileImagePath = res.downloadURL;
      this.databaseService.setDataByUID(this.data.uid, 'userDetail', this.data.userDetail).then((res) => {
        this.loading = false;
      }).catch((err) => {
        this.loading = false;
        console.error(err);
      });
    }, (err) => {
      this.profileImageLoading = false;
      console.error(err);
    });
    this.dataChanged();
  }

  removeProfileImage(){
    if(this.data.userDetail.profileImagePath!==''){
      this.storageService.deleteFileByUID(this.globalService.data.uid, CONFIG.application.profilePictureName+'.'+this.commonService.getExtensionFromURL(this.data.userDetail.profileImagePath)).then(()=>{
        this.data.userDetail.profileImagePath = '';
        this.databaseService.setDataByUID(this.data.uid, 'userDetail', this.data.userDetail).then((res) => {
          this.loading = false;
        }).catch((err) => {
          this.loading = false;
          console.error(err);
        });
      }).catch((err)=>{
        console.error(err);
      });
    }else{
      console.warn('profile image path is empty');
    }
  }

  submit() {
    if ((this.data.userDetail.profileImagePath).trim() == '') {
      this.error.profileImagePathIsError = true;
      this.error.profileImagePathAlert = 'upload profile-picture';
      this.dataModified = true;
    } else {
      this.error.profileImagePathIsError = false;
      this.error.profileImagePathAlert = 'some error';
    }
    if ((this.data.userDetail.profileName).trim() == '') {
      this.error.profileNameIsError = true;
      this.error.profileNameAlert = 'enter profile-name';
      this.dataModified = true;
    } else {
      this.error.profileNameIsError = false;
      this.error.profileNameAlert = 'some error';
    }
    if ((this.data.userDetail.birthday).trim() == '') {
      this.error.birthdayIsError = true;
      this.error.birthdayAlert = 'enter birthday';
      this.dataModified = true;
    } else {
      this.error.birthdayIsError = false;
      this.error.birthdayAlert = 'some error';
    }
    if ((this.data.userDetail.gender).trim() == '') {
      this.error.genderIsError = true;
      this.error.genderAlert = 'select gender';
      this.dataModified = true;
    } else {
      this.error.genderIsError = false;
      this.error.genderAlert = 'some error';
    }
    //console.log(this.data.userDetail.profileName, this.data.userDetail.birthday, this.data.userDetail.gender);
    if (!this.dataModified) {
      this.page_1 = false;
      this.page_2 = true;
      return;
    }
    if (!this.error.profileNameIsError && !this.error.birthdayIsError && !this.error.genderIsError && !this.error.profileImagePathIsError) {
      this.saveProfileData();
    } else {
      console.error('some error');
    }
  }

  saveProfileData() {
    if (this.data.database) {
      this.loading = true;
      this.databaseService.setDataByUID(this.data.uid, 'userDetail', this.data.userDetail).then((res) => {
        this.loading = false;
        this.dataModified = false;
        this.page_1 = false;
        this.page_2 = true;
      }).catch((err) => {
        this.loading = false;
        console.error(err);
      });
    } else {
      console.error('database not enabled');
      alert('database not enabled');
    }
  }

  retriveProfileData() {
    if (this.data.database) {
      this.databaseService.getDataByUID(this.data.uid, 'userDetail').then((res) => {
        console.log('successfully retrived');
        this.data.userDetail = res;
      }).catch((err) => {
        console.error(err);
      });
    } else {
      console.error('database not enabled');
      alert('database not enabled');
    }
  }

  edit() {
    this.page_2 = false;
    this.page_1 = true;
  }

  emitter(obj: any) {
    if (obj && obj.page) {
      this.commonService.navigateTo(obj.page);
    } else {
      console.log('page not available =>', obj);
    }
  }
}
