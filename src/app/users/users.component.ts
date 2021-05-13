import {Component, OnInit} from '@angular/core';
import {AppService} from '../app.service';
import {DataService} from '../services/data.service';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';

declare const $: any;

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  public rows = [];
  public srch = [];

  public addU: any = {};
  public uptU: any = [];

  public userPond = true;
  productionData: any = [];

  ecoData: any = {};
  isHidden = true;
  ecoDataForm: FormGroup;
  dateFrom: '';
  dateTo = '';
  totalUsers: any;
  ecoIndicator: any = [];

  fishHealthRecord: any = [];

  
  fishHealthForm: FormGroup;
  productionDataForm: FormGroup;

  isFishPondHealth = false;
  public newPondId: any;

  constructor(
    private formBuilder: FormBuilder,
    private userService: AppService,
    private dataService: DataService
  ) {
    this.rows = userService.users;
    this.srch = [...this.rows];
  }

  ngOnInit() {
    this.fishHealthForm = this.formBuilder.group({
      dateFrom: [null],
      dateTo: [null],
      userId: [null]
    });
    
    $('.floating').on('focus blur', function (e) {
      $(this).parents('.form-focus').toggleClass('focused', (e.type === 'focus' || this.value.length > 0));
    }).trigger('blur');

    this.addU = {
      'user_name': '',
      'email': '',
      'company': '',
      'role': '',
      'user_id': 0
    };
    this.uptU = {
      'user_name': '',
      'email': '',
      'company': '',
      'role': '',
      'user_id': 0
    };

    this.getMyPonds();
  }


  getMyPonds() {
    this.dataService.getUserFarmPonds()
      .subscribe(res => {
        this.rows = res;
        console.log('get user ponds responds >>>', this.rows);
      }, err => {
        console.log('error getting user ponds', err);
      });
  }

  getFishPondHealthId(pondId: string) {
    console.log(`fishhealth pondId: ${pondId}`);
    this.newPondId = pondId;
    $('#fishpondHealthForm').modal('show');

  }

  getPondProductionId(pondId: string) {
    console.log(`fishhealth pondId: ${pondId}`);
    this.newPondId = pondId;
    $('#productionDataForm').modal('show');
  }

  checkProductionData(userId: string) {
    console.log(`userId: ${userId}`);
    this.dataService.postUserPondProductionData(userId)
      .subscribe(cpdRes => {
        this.productionData = cpdRes;
        console.log(`user productionData: ${this.productionData}`);
      },
        error => {
          console.error(`error loading user producationData: ${error}`);
        });
  }

  checkEconomicIndicator(userId: string) {
    console.log(`ecoIndicator userId: ${userId}`);
    this.dataService.calculateEconomicIndicator(userId)
      .subscribe(res => {
        // this.ecoIndicator = res;
        console.log('ctr: user economicIndicators', this.ecoIndicator);
        $('#ecoIndicator').modal('show');
        // this.router.navigateByUrl('/clients/profile/details', { state: this.rows });
      }, error => {
        console.log('ctr: error economic indicator', error);
      });
  }

  calcFishPondHealth(f: any) {
    console.log('FishPond Health items >>>', f);
    console.log('FishPond Health', f.dateFrom.formatted);
    console.log('FishPond Health', f.dateTo.formatted);
    f.pondId = this.newPondId;
    this.dataService.postUserFishPondHealth(f)
      .subscribe( res => {
        // this.rows.pondId = this.newPondId;
        this.fishHealthRecord = res;
        console.log('ctr: FishHealth Records =>', this.fishHealthRecord);
        console.log('hide fishHealthForm ...');
        $('#fishpondHealthForm').modal('hide');
        console.log('show fishHealthRecords ...');
        $('#fishHealthRecords').modal('show');
        this.isFishPondHealth = true;
        // this.router.navigateByUrl('/clients/profile/details', { state: this.rows });
      }, error => {
        this.isFishPondHealth = false;
        console.log('ctr: error calc fishpond health: ', error);
      });
  }
  calcProductionData(f: any) {
    console.log('FishPond Production data', f);
    console.log('FishPond Production data', f.dateFrom.formatted);
    console.log('FishPond Production data', f.dateTo.formatted);

    this.dataService.postUserPondProductionData(f)
      .subscribe( res => {
        this.rows = res;
        console.log('ctr: Production data', this.rows);
        $('#productionDataForm').modal('hide');
        console.log('hide #productionDataForm');
        $('#productionDataRecords').modal('show');
        this.isFishPondHealth = true;
        this.getMyPonds(); 
        // this.router.navigateByUrl('/clients/profile/details', { state: this.rows });
      }, error => {
        this.isFishPondHealth = false;
        console.log('ctr: error calc fishpond production data: ', error);
      });
  }


  addReset() {
    let randomnumber = Math.floor(Math.random() * 300);
    this.addU = {'user_id': randomnumber};
    $('#add_user').modal('show');
  }

  addUser(f) {
    // console.log(f.form.value);
    if (f.invalid === false) {
      this.rows.unshift(f.form.value);
      this.srch.unshift(f.form.value);
      this.rows = this.rows;
      $('#add_user').modal('hide');
    }
  }

  onEdit(item) {
    this.uptU = item;
    $('#edit_user').modal('show');
  }

  updateUser(f) {
    // console.log(f.form.value);
    if (f.invalid === false) {
      var id = f.form.value.user_id;
      // console.log(id);
      var arr = this.rows.find(function (item, i) {
        return item.user_id === id;
      });

      arr.user_id = f.form.value.user_id;
      arr.user_name = f.form.value.user_name;
      arr.email = f.form.value.email;
      arr.company = f.form.value.company;
      arr.role = f.form.value.role;

      var index = this.rows.findIndex(function (item, i) {
        return item.user_id === id;
      });

      // console.log(index);
      if (index > -1) {
        this.rows.splice(index, 1);
      }

      this.rows.unshift(arr);
      this.srch.unshift(arr);
      this.rows = this.rows;
      $('#edit_user').modal('hide');
    }
  }

  onDelete(c) {
    // console.log("="+c.user_id+"=");
    var index = this.rows.findIndex(function (item, i) {
      return item.user_id === c.user_id;
    });

    // console.log(index);
    if (index > -1) {
      this.rows.splice(index, 1);
      this.srch.splice(index, 1);
    }
    // console.log(this.rows);
    this.rows = this.rows;
  }

}
