$(document).ready(function () {    
    $(document).ajaxSend(function() {
        init();
        $("#overlay").fadeIn(300);
      });
    $("#submit").click(function (e) { 
        e.preventDefault();
        var handle=$("#handle").val();
        if(handle==''){
            alert('required');
            return;
        }
        var url="https://codeforces.com/api/user.info?handles=";
        var rate_url="https://codeforces.com/api/user.rating?handle=";
        $.ajax({
            type: "GET",
            url: url+handle,        
            success: function (res) {                              
                if(res.status=="OK"){                                  
                    var data=res['result'][0]; 
                  
                    if(data.rating==undefined){
                       netError("other");
                        return;
                    } 
                    var full_name="Not Found";
                    if(data.firstName!=undefined)                       
                      full_name=data.firstName+" "+data.lastName;
                    $("#profile_img").attr('src', data.titlePhoto);   
                    $("#user_name").text(full_name); 
                    $("#user_org").text(data.organization); 
                    $("#user_country").text(data.country); 
                    $("#user_old_rank").html(data.maxRating+" (  <span class='text-danger''>"+data.maxRank+" </span>) ");
                    $("#cur_rate").html(data.rating+" (  <span class='text-danger''>"+data.rank+" </span>) ");
                    $("#user_friend").text(data.friendOfCount);
                    var last_online=new Date(data.lastOnlineTimeSeconds*1000);
                    var reg_time=new Date(data.registrationTimeSeconds*1000);
                    var reg=reg_time.getDay()+"/"+reg_time.getMonth()+"/"+reg_time.getFullYear();
                    $("#online").text(last_online);                   
                    $("#reg").text(reg);                   
                    $("#contribute").text(data.contribution);                   
                    $.ajax({
                        type: "GET",
                        url: rate_url+handle,  
                        success: function (response) {
                            if(response.status=="OK"){                               
                                var rate_data=response['result'];                                                          
                                $("#total_contest").text(rate_data.length);
                                var xValues = [];
                                var yValues = [];
                                for(var i=0;i<rate_data.length;i++){
                                    xValues.push(rate_data[i].contestId);
                                    yValues.push(rate_data[i].newRating);                               
                                }                            

                                var myChart = new Chart("myChart", {
                                    type: "line",
                                    data: {
                                        labels: xValues,
                                        datasets: [{
                                        fill: false,
                                        lineTension: 0,
                                        backgroundColor: "rgba(0,0,255,1.0)",
                                        borderColor: "rgba(0,0,255,0.1)",
                                        data: yValues
                                    }]
                                    },
                                    options: {
                                    legend: {display: false},
                                    scales: {
                                        yAxes: [{ticks: {min: 100, max:data.maxRating+100}}],
                                    }
                                    }
                                });
                                $(".emp-profile").removeClass('d-none'); 
                                $("#reset").removeClass('d-none'); 
                                $(".no-date").addClass('d-none'); 
                            }
                        }
                    });                  
                   
                }
             
                
            } ,
            error:function (xhr, ajaxOptions, thrownError) {
                if(xhr.status==0){
                   netError("error");
                }
                
              }          
        }).done(function() {
            setTimeout(function(){
              $("#overlay").fadeOut(300);
            },500);
          }).fail(function() {         
            setTimeout(function(){
                $("#overlay").fadeOut(300);
            },200);
            netError("404");           
        });
    });

    $("#reset").click(function () { 
        $("#handle").val('');
        $(".emp-profile").addClass('d-none'); 
        $("#reset").addClass('d-none'); 
        
    });
});

function init(){
    $("#reset").addClass('d-none'); 
    $(".emp-profile").addClass('d-none'); 
    $(".no-date").addClass('d-none'); 
    $(".n_found").addClass('d-none'); 
    $(".net_error_508").addClass('d-none'); 
    $(".net_error_404").addClass('d-none'); 
}

function netError(net) {
    
    $("#reset").removeClass('d-none');       
    $(".no-date").removeClass('d-none'); 
    
    if(net=="508"){
        $(".net_error_508").removeClass('d-none'); 
    }else if(net=="other"){
        $(".n_found").removeClass('d-none'); 
    }else if(net=="404"){
        $(".net_error_404").removeClass('d-none');
    }

}