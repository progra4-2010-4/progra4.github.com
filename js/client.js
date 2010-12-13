function guid(){
    var S4 = function S4(){
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

function send(fname, ary){
    var retval=[];
    for(var i=0; i<ary.length; i++ ){
        retval.push(ary[i][fname]());
    }
    return retval;
}

var Gist = new function(){

    this.persist = function(key, gist){
      localStorage.setItem(key, JSON.stringify({
          title: gist.title,
          categories: send("toLowerCase", gist.categories.split(/\s+,\s+/)),
          content: gist.content,
          created_at: new Date()
      })); 
      return localStorage.getItem(key);
    };

    this.search_by_category = function(category){
        var results = [];
        var key;
        for(var i=0; i< localStorage.length; i++){
            key = localStorage.key(i);
            if(key=="name"){continue;}
            i = localStorage.getItem(key);
            if ((JSON.parse(i)).categories.indexOf(category.toLowerCase()) != -1){
                results.push(i);
            }
        }
        return results;
    };

    this.display = function(key){
        item = JSON.parse(localStorage.getItem(key));
        item.created_at = new Date(item.created_at);
        return "<li class='gist' data-key='"+key+"'>"+item.title+"<span class='date'> "
                           +item.created_at.toLocaleDateString()
                           +"(a las "+item.created_at.toLocaleTimeString()+")</span></li>";
    }

    this.setExample = function(){
        if(!localStorage.getItem("example")){
        this.persist("example",
                {title: "Ejemplo",
                 categories: "examen, progra4",
                 content: "Aquí _hay_ **markdown** y <pre><code>@notes.each{|n| puts n}</pre></code> `código`"
                });
        }
    }
}


$(function(){
   $("#display").hide();
   $("textarea").elastic();
   Gist.setExample();
   converter = new Showdown.converter();

   if(!Modernizr.localstorage) {
    alert("Este browser no soporta html5, favor probar en otro");
   }
   if(localStorage.length > 0){
    var item;
    var key; 
    for(var i=0; i< localStorage.length; i++){
        key = localStorage.key(i);
        if(key=="name"){
            $("#name").text("Gists de "+localStorage.getItem(key));
            continue;
        }
        $("#gists").append(Gist.display(key));
    }
   }
   
   $(".gist").live('click', function(e){
    tgt = $(e.target);
    if(!tgt.is("li")){
        tgt = tgt.parent();
    }
    var gist = JSON.parse(localStorage.getItem(tgt.data("key")));
    $("#edition").hide();
    $("#display").show();
    $("#note").html(converter.makeHtml(gist.content));
    $('pre code', $("#display")).each(function(i, e) {hljs.highlightBlock(e)});    
   });
   $("[name='title']").focus(function(){
    $(".error").remove();
   });
   $("#edition").submit(function(e){
    e.preventDefault();
    if($("[name='title']").val() == ""){
        $("[name='title']").before("<span class='error'>El título no puede estar en blanco</span>");
        return false;
    }
    var key = guid();
    Gist.persist(key, {title: $("[name='title']").val(), 
                                  categories:  $("[name='categories']").val(),
                                  content:  $("[name='content']").val()});
    $("#gists").append(Gist.display(key));
    $("[name='title'], [name='categories'], [name='content']").val("");
   });

   $("#add").click(function(e){
    e.preventDefault();
    $("#edition").show();
    $("#display").hide();
   });
});
