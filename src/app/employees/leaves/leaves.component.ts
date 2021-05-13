import {Component, OnInit} from '@angular/core';
import {IMyDpOptions} from 'mydatepicker';
import {ActivatedRoute, Router} from '@angular/router';
import {AppService} from 'src/app/app.service';
import {DataService} from '../../services/data.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { formatDate } from '@angular/common';

declare const $: any;

@Component({
  selector: 'app-leaves',
  templateUrl: './leaves.component.html',
  styleUrls: ['./leaves.component.css']
})
export class LeavesComponent implements OnInit {

  public myDatePickerOptionsT: IMyDpOptions = {
    todayBtnTxt: 'Today',
    dateFormat: 'dd-mm-yyyy',
    firstDayOfWeek: 'su',
    sunHighlight: true,
    inline: false,
    height: '48px'
  };
  public myDatePickerOptionsF: IMyDpOptions = {
    todayBtnTxt: 'Today',
    dateFormat: 'dd-mm-yyyy',
    firstDayOfWeek: 'su',
    sunHighlight: true,
    inline: false,
    height: '48px'
  };
  public myDatePickerOptions1: IMyDpOptions = {
    todayBtnTxt: 'Today',
    dateFormat: 'yyyy-mm-dd',
    firstDayOfWeek: 'su',
    sunHighlight: true,
    inline: false,
    height: '38px'
  };
  public myDatePickerOptions: IMyDpOptions = {
    todayBtnTxt: 'Today',
    dateFormat: 'dd-mm-yyyy',
    firstDayOfWeek: 'su',
    sunHighlight: true,
    inline: false,
    height: '38px'
  };


  rows: any = [];
  fishHealthRecord: any = [];

  public srch = [];
  public addL: any = {};
  addLeaveValidation = false;
  public isLoading = true;
  public loadingMsg = '';
  public errorMsg = '';
  public allLeaves = true;

  fishHealthForm: FormGroup;
  productionDataForm: FormGroup;
  dateFrom: '';
  dateTo = '';

  isFishPondHealth = false;
  public newPondId: any;
  constructor(
    private formBuilder: FormBuilder,
    private appService: AppService,
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService
  ) {
    this.rows = appService.leaves;
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

    // var date1 = new Date("7/13/2010");
    // var date2 = new Date("7/11/2010");
    // var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    // var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    // console.log(diffDays);

    this.getAllUserPonds();
  }

  getAllUserPonds() {
    this.dataService.getAllUserPonds()
      .subscribe(res => {
        this.rows = res;
        this.isLoading = false;
        this.loadingMsg = 'data loading ...';
        console.log('UserPondsComponent: all user ponds responds >>>', this.rows);
      }, err => {
        console.log('UserPondsComponent: error getting all user ponds', err);
      });
  }

  checkEconomicIndicator(f: any) {
    console.log('economic indicator items', f);
    console.log('economic indicator items', f.dateFrom.formatted);
    console.log('economic indicator items', f.dateTo.formatted);

    this.dataService.calculateEconomicIndicator(f)
      .subscribe( res => {
        this.rows = res;
        console.log('ctr: economic indicator', this.rows);
        $('#ecoIdicator').modal('hide');
        // this.router.navigateByUrl('/clients/profile/details', { state: this.rows });
      }, error => {
        console.log('ctr: error economic indicator', error);
      });
  }

  getPondId(pondId: string) {
    console.log(`fishhealth pondId: ${pondId}`);
    this.newPondId = pondId;
    $('#fishpondHealthForm').modal('show');

  }

  getPondProductionId(pondId: string) {
    console.log(`fishhealth pondId: ${pondId}`);
    this.newPondId = pondId;
    $('#productionDataForm').modal('show');
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
        this.getAllUserPonds();
        // this.router.navigateByUrl('/clients/profile/details', { state: this.rows });
      }, error => {
        this.isFishPondHealth = false;
        console.log('ctr: error calc fishpond production data: ', error);
      });
  }


  addReset() {
    this.addL = {'days': 2, 'status': 'New'};
    $('#add_leave').modal('show');
  }
  addSubmit(f) {

  }

  addLeave(f) {
    // console.log(f.form.value);
    const randomnumber = Math.floor(Math.random() * 99);
    f.form.value.leave_id = randomnumber;
    if (f.invalid === true) {
      this.addLeaveValidation = true;
    } else {
      this.addLeaveValidation = false;
      this.rows.unshift(f.form.value);
      this.srch.unshift(f.form.value);
      this.rows = this.rows;
      $('#add_leave').modal('hide');
    }
  }

  onEdit(item) {
    this.router.navigate(['employees/leaves/edit'], {queryParams: {'id': item.leave_id}});
  }

  onDelete(id) {
    // console.log("="+id+"=");
    // let index = this.leaves.indexOf(id);

    const index = this.rows.findIndex(function (item, i) {
      return item.leave_id === id;
    });

    // console.log(index);
    if (index > -1) {
      this.rows.splice(index, 1);
      this.srch.splice(index, 1);
    }
    // console.log(this.rows);
    this.rows = this.rows;
  }

  searchType(val) {
    // console.log(val);
    // console.log(this.srch);
    this.rows.splice(0, this.rows.length);
    // console.log(this.rows);
    const temp = this.srch.filter(function (d) {
      // console.log(d.leaveType);
      val = val.toLowerCase();
      return d.leaveType.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // console.log(temp);
    this.rows.push(...temp);
    // console.log(this.rows);
  }

  searchName(val) {
    // console.log(val);
    // console.log(this.srch);
    this.rows.splice(0, this.rows.length);
    // console.log(this.rows);
    const temp = this.srch.filter(function (d) {
      // console.log(d.employeeName);
      val = val.toLowerCase();
      return d.fullName.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // console.log(temp);
    this.rows.push(...temp);
    // console.log(this.rows);
  }
  searchID(val) {
    // console.log(val);
    val = val.toString();
    // console.log(this.srch);
    this.rows.splice(0, this.rows.length);
    // console.log(this.rows);
    const temp = this.srch.filter(function (d) {
      // console.log(d.employeeID);
      d.pondId = d.pondId.toString();
      return d.pondId.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // console.log(temp);
    this.rows.push(...temp);
    // console.log(this.rows);
  }
  searchStatus(val) {
    // console.log(val);
    // console.log(this.srch);
    this.rows.splice(0, this.rows.length);
    // console.log(this.rows);
    const temp = this.srch.filter(function (d) {
      // console.log(d.status);
      val = val.toLowerCase();
      return d.status.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // console.log(temp);
    this.rows.push(...temp);
    // console.log(this.rows);
  }

}
