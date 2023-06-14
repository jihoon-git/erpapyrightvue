<template>
    <div id="layer">
        <dl>
            <dt><strong id="purCaption" class="pl-2">구매 내역</strong></dt>
            <dd class="content">
                <table class="col" id="orderinfo">
                    <thead>
                        <tr>
                            <th scope="col">상세번호</th>
                            <th scope="col">상품명</th>
                            <th scope="col">주문개수</th>
                            <th scope="col">총 금액</th>
                        </tr>
                    </thead>

                    <template v-if="infoList.length>0">
                        <tbody v-for="item in infoList" :key="item.purinf_id">
                            <tr>
                                <td class="targetIdx">{{item.purinf_id}}</td>
                                <td>{{item.sales_nm}}</td>
                                <td>{{item.pur_cnt}}</td>
                                <td>{{item.price_sum}}</td>
                            </tr>
                        </tbody>
                    </template>
                    <template v-else>
                        <tr>
                            <td colspan="4">주문내역이 비었습니다 DB 의 정합성이 맞지 않습니다. 팀원에게 문의하세요</td>
                        </tr>
                    </template>

                </table>
                
                <div class="d-flex justify-content-around my-4">  
                    <div>
                        <input type="radio" name="formType" value="shippingDir" @click='callDir($event,idx)'/>
                        <span>배송지시서</span>
                    </div>
                    <div>
                        <input type="radio" name="formType" value="orderDir" @click='callDir($event,idx)'/>
                        <span>발주지시서</span>
                    </div>
                    
                </div>
                
                <!-- 지시서 작성을 위한 area -->
                <div id="dirArea">
                    <!-- 배송 지시서 작성시 -->
                    <div id="v-warehouse" v-if='shippingDirActivate'>

                        <!-- 객체안의 요소를 돌면서 출력하는 기능도 지원한다 
                                name 은 객체의 변수명이며, value 는 값이다
                                이 경우에는 서버에서 응답받은 data의 list key 의 값인
                                타입이 list가 아니라 Map 이기 때문에
                                axios 통신시 객체형태로 변환되게 된다.
                                {상품이름1:유효한창고리스트... , 상품이름2:유효한창고리스트2...}
                        --> 
                        <template v-if="Object.keys(stocksMap).length>0">
                        

                            
                            <template v-for='(value,name) in stocksMap' :key="name">

                                <div class="my-3">
                                    <div class="text-left mb-1">
                                        <strong class="pl-2">{{name}}</strong>
                                    </div>
                                    <table class="col">
                                        <thead>
                                            <tr>
                                                <th scope="col">선택</th>
                                                <th scope="col">창고</th>
                                                <th scope="col">총 재고</th>
                                                <th scope="col">출고예정</th>
                                                <th scope="col">유효재고</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <template  v-for='info in value' :key='info.wh_id'>
                                                <tr>
                                                    <td>
                                                        <input type="checkbox" class="shippingTarget" :value='info.wh_id+","+info.sales_id' @change="selectCheckBox">
                                                    </td>
                                                    <td>{{info.wh_nm}}</td>
                                                    <td>{{info.st_cnt}}</td>
                                                    <td>{{info.export_cnt}}</td>
                                                    <td>{{info.valid_cnt}}</td>
                                                </tr>
                                            </template>
                                        </tbody>
                                    </table>
                                </div>   
                            </template>

                        </template>
                        <template v-if="Object.keys(stocksMap).length==0">
                            <div class="my-5 text-center">
                                <strong>주문한 상품이 창고에 없습니다 발주를 먼저 진행하세요</strong>
                            </div>
                        </template>
                    </div>
                    

                    <div id="v-orderAndReturn" v-if="orderDirActivate">
                        <!-- list 가 담은 정보 : 해당 주문 및 반품 정보에 있는 상품 번호와 상품이름 정보 -->
                        <template v-for="(item,index) in salesInfo" :key="index">
                            <div class="text-left orderinfo">
                                <div class="salesinfo">
                                    <template v-for="(ele,index) in item" :key="index">
                                        <input type="hidden" class="idx" :value="ele" v-if="index==0">
                                        <strong style="padding-right:20px;" v-if="index==1">{{ele}}</strong>
                                        <img src="../../assets/images/treeview/minus.gif" v-if="index==1" @click="cancel($event, ele)">
                                    </template>
                                </div>
                                <div class="d-flex input-group my-2">
                                    <select class="form-control supplyIdx h-auto">
                                        <option v-for="item in supplyList" :key='item.dtl_cod' :value='item.dtl_cod'>
                                            {{item.dtl_cod_nm}}
                                        </option>
                                    </select>
                                    <input type="text" class="orderCnt form-control" placeholder="수량">
                                </div>
                            </div>
                        </template>
                    </div>

                    <div class="text-center mt-4">
                        <button type="button" class="btn btn-primary mx-2" @click="writeDir">작성</button> 
                        <button type="button" class="btn btn-light mx-2" @click="close">취소</button>
                    </div>
                </div>
            </dd>
        </dl>
    </div>

</template>
    
<script>
    import {closeModal} from "jenesius-vue-modal"
    export default{
        props:{'idx':Number, 'class':String, 'modal-id':String},
        data:function(){
            return{
                infoList:[],
                stocksMap:[],
                salesInfo:[],
                supplyList:[],
                depositYN:null,
                shippingDirActivate:null,
                orderDirActivate:null
            }
        },
        created:function(){
            this.getDetails(this.idx);
        },
        methods:{
            getDetails:function(idx){
                let vm = this;
                this.axios
                    .post('/scm/vue/order/'+idx)
                    .then((resp)=>{
                    vm.infoList=resp.data.infoList;
                    vm.depositYN=resp.data.depositYN; 
                    })
                    .catch((err)=>{
                        console.log(err);
                    })
            },
            callDir:function(event,idx){
                let formType=event.target.value;
                let vm=this;
                this.axios
                    .post('/scm/vue/dir/'+formType+'/'+idx)
                    .then((resp)=>{
                        console.log(resp);
                        if(formType=='shippingDir'){
                            vm.orderDirActivate=false;
                           
                            vm.shippingDirActivate=true;
                            
                            vm.stocksMap=resp.data.list;
                            console.log(vm.stocksMap);
                        }else if(formType=='orderDir'){
                            vm.shippingDirActivate=false;
                            vm.orderDirActivate=true;
                            vm.salesInfo=resp.data.listOfSalesInfoList;
                            vm.supplyList=resp.data.supplyList;
                        }
                    })
                    .catch((err)=>{
                        console.log(err);
                    })

                    return true;
            },
            writeDir:function(){
                let checkedDom = document.querySelector('input[name="formType"]:checked');
                if(this.directivesIsChecked(checkedDom)){
                    
                    let formType=checkedDom.value;
                    let params=new URLSearchParams();
                   
                    let globalValidated=true;


                    if(formType=='shippingDir'){
                        let shippingTargets=document.querySelectorAll('.shippingTarget');
                        let targets=document.querySelectorAll('.shippingTarget:checked');
                        let orderinfos=document.querySelectorAll('#orderinfo tbody tr');
                        if(this.shippingDirIsValidated(shippingTargets, targets, orderinfos)){
                            targets.forEach((item)=>{
                                params.append('targetWh',item.value);
                            });
                            this.infoList.forEach((item)=>{
                                params.append('idxList',item.purinf_id);
                            });
                        }else{
                            globalValidated=false;
                        }
                    }else if(formType=='orderDir'){
                        let orderinfos= document.querySelectorAll('.orderinfo');
                        if(this.orderDirIsValidated(orderinfos)){
                            document.querySelectorAll('.orderinfo').forEach(function(item){
                                // 상품번호
                                let salesID=item.querySelector('.idx').value;
                                // 납품회사번호
                                let compID=item.querySelector('.supplyIdx').value;
                                // 수량
                                let quantInputDom=item.querySelector('.orderCnt');
                                let quant = quantInputDom.value;  
                                let regExp=new RegExp(/^[1-9]+\d*$/g);
                                if(!regExp.test(quant)){
                                    alert('수량은 숫자만 입력가능합니다');
                                    globalValidated=false;
                                    return;
                                }else{
                                    // 3개의 쌍을 targetWh에 추가
                                    // targetWh.push(compID);
                                    params.append('targetWh',salesID+','+compID+','+quant);    
                                }                       
                            })
                        }else{
                            globalValidated=false;
                        }
                        
                        if(globalValidated){
                            params.append('formType',formType);
                            let vm=this;
                            let msg=formType=='shippingDir'?'배송지시서':'발주지시서';
                            
                            if(confirm(msg+' 를 작성하시겠습니까?')){
                            
                                this.axios({
                                    url:'/scm/vue/direction',
                                    data:params,
                                    method:'post'
                                })
                                .then((resp)=>{
                                    switch(resp.status){
                                        case 500:{
                                            alert('123');
                                            break;
                                        }
                                        case 801:{
                                            alert('숫자만 입력하실 수 있습니다');
                                            break;
                                        }
                                        case 200:{
                                            if(formType=="shippingDir"){
                                                alert('배송지시서가 작성되었습니다');
                                            }else{
                                                alert('발주 지시서가 작성되었습니다');
                                            }
                                            vm.emitter.emit('requestOrdersList');
                                            closeModal(vm);
                                        }
                                    }
                                })
                                .catch((err)=>{
                                    console.log(err);
                                })
                            }
                        }
                    }
                }
            },
            directivesIsChecked:function(checkedDom){
                let checked=true;
                if(checkedDom==null || checkedDom==undefined){
                    alert('지시서를 선택하세요');
                    checked=false;
                }
                return checked;
            },
            shippingDirIsValidated:function(shippingTargets, targets, orderinfos){
                let validated=true;
                if(targets==null || shippingTargets.length!=orderinfos.length){
                    alert('창고에 없는 주문상품이 있습니다. 발주를 먼저 진행하세요');
                    validated=false;
                }else{
                    if(targets.length!=orderinfos.length){
                        alert('출고창고를 선택하지 않은 상품이 있습니다');
                        validated=false;
                    }
                }
                return validated;
            },
            orderDirIsValidated:function(orderinfos){
                let validated=true;
                if(orderinfos==null){
                    validated=false;
                    alert('발주 상품이 없습니다');
                }
                return validated;
            },
            close:function(){ 
                closeModal(this);
            },
            cancel:function(event,salesName){
                if(confirm(salesName+' 발주를 취소하시겠습니까?')){
                    event.target.parentNode.parentNode.remove();
                }
            },
            selectCheckBox:function(event){
                console.log('checked/...');
                let tBodyDom=event.target.parentNode.parentNode.parentNode;
                tBodyDom.querySelectorAll('.shippingTarget:checked').forEach((item)=>{
                    if(item!==event.currentTarget){
                        item.checked=false;
                    }                    
                });          
            }
        }
    }
</script>

<style>
    #layer{
        padding: 20px;
        border: 2px solid rgb(124,124,124);
        background-color: #fff;
        border-radius: 10px;
    }
    #purCaption{
        font-size: 20px;
    }
    #purCaption::after{
        content: '';
        display: block;
        border-top: 1px solid rgb(197,197,197);
        margin-bottom: 20px;
        margin-top: 8px;
    }
</style>