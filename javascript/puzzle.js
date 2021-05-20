$(document).ready(function() {

    var counter = 1;
    var started = false;
    var selectedImage;



    $(".startBtn").hover(function() {

        if (!started) {

            setInterval(function() {

                counter++;

                if (counter == 4)
                    counter = 1;

                $(".middle").css("display", "none");

                var elem = "#info" + counter;
                $(elem).fadeIn("slow", function() {
                    $(elem).css("display", "inline-block");
                });


            }, 3000);

            started = true;

        }

    });


    $(".startBtn").click(function() {

        $("#start").css("display", "none");
       

        $('#selectImg').fadeIn("slow", function() {
           

            $("#selectImg").css("display", "block");
        });
    });

    $(".image").click(function() {
        selectedImage = $(this).attr('id');
        $(".cntBtn").css("display", "inline");
        $(".image").find("img").css("opacity", "0.6");
        $(this).find("img").css("opacity", "1");
        $(this).find("img").css("box-shadow", "10px 10px 5px grey");
        
        selectedImage = $(this).find("img").attr("src");

    });

    $(".cntBtn").click(function() {
        $("#selectImg").css("display", "none");
        
        $('#puzzleArea').fadeIn("slow", function() {
           

            $("#puzzleArea").css("display", "block");
        });

        

        var tableString = '';
        tableString += "<div id='puzzle' style='position: relative; height: 460px; width: 460px; border-collapse: collapse;border-spacing: 0px;border: 2px grey solid;background-color : #e4dee8'>";




        for (row = 0; row < 3; row += 1) {



            for (col = 0; col < 3; col += 1) {

                if (row != 0 || col != 0) {
                    tableString += '<div class="imgP ' + row + '-' + col + '" id="' + row + '-' + col + '" style="left: ' + (150 * col + 2 * col + 2) + 'px; top: ' + (150 * row + 2 * row + 2) + 'px">' + '<div id="' + row + '-' + col + '" style="width:150px; height: 150px; background-image: url(' + selectedImage + '); background-position: ' + 300 * col + 'px ' + 300 * row + 'px; border-radius: 8px;"></div></div>';
                }


            }
        }

        tableString += "</div>";
        tableString += '<div id="shuffleArea" style="width: 450px; margin-top: 40px;" <span>Select </span> <select id="move"> <option value="0">--Suffle Amount--</option> <option value="3">3 Moves</option> <option value="30">30 Moves</option> </select><div id="btnPlace"></div></div>';

        $('#puzzleArea').append(tableString);




    });

    $(document).on("click", ".imgP", function() {
        console.log($(this).attr("id"));

    });

    $(document).on("change", "#move", function() {

        if ($("#move").children("option:selected").val() != '0') {
            $("#btnPlace").html("");
            btnString = "<button id='sffBtn' style='margin-top: 20px;'>SHUFFLE</button>";
            $("#btnPlace").append(btnString);
        } else {
            $("#btnPlace").html("");
        }

    });


    var shuffleAmount;
    var scounter = 0;
    var choosen = "0";
    var empty = "0-0";
    var available;
    var randomItem;
    var top;
    var left;
    var shuffleFinished = false;

    function random_item(items) {

        return items[Math.floor(Math.random() * items.length)];

    }


    function getAvailables(empty, choosen) {

        var availables = [];
        x = parseInt(empty[0]);
        y = parseInt(empty[2]);

        if (x - 1 >= 0 && choosen !== (x - 1).toString() + "-" + y.toString())
            availables.push((x - 1).toString() + "-" + y.toString());
        if (x + 1 <= 2 && choosen !== (x + 1).toString() + "-" + y.toString())
            availables.push((x + 1).toString() + "-" + y.toString());
        if (y - 1 >= 0 && choosen !== x.toString() + "-" + (y - 1).toString())
            availables.push(x.toString() + "-" + (y - 1).toString());
        if (y + 1 <= 2 && choosen !== x.toString() + "-" + (y + 1).toString())
            availables.push(x.toString() + "-" + (y + 1).toString());

        return availables;
    }



    var animasyon = function() {

        available = getAvailables(empty, choosen);

        randomItem = random_item(available);
        top = (parseInt(randomItem[0]) - parseInt(empty[0]));
        left = (parseInt(randomItem[2]) - parseInt(empty[2]));

        if (top != 0) {
            $("." + randomItem).animate({
                top: "-=" + (top * 150 + top * 2) + "px",
            }, 50, function() {

                $("." + randomItem).addClass(empty);
                $("." + randomItem).removeClass(randomItem);
                choosen = empty;
                empty = randomItem;

            });

        } else if (left != 0) {
            $("." + randomItem).animate({
                left: "-=" + (left * 150 + left * 2) + "px",
            }, 50, function() {

                $("." + randomItem).addClass(empty);
                $("." + randomItem).removeClass(randomItem);
                choosen = empty;
                empty = randomItem;
            });
        }

        scounter++;
        if (scounter == shuffleAmount) {
            clearInterval(begin);

            $("#puzzleArea").append("<h3 style='width: 450px' id='solveText'>SOLVE PUZZLE NOW</h3>");


            $('#solveText').animate({fontSize: "+50px"});
            $('#solveText').css("font-size", "350px");



           
            shuffleFinished = true;
        }
    }

    $(document).on("click", "#sffBtn", function() {

        $("#shuffleArea").css("display", "none");

        shuffleAmount = $("#move").children("option:selected").val();
        if(shuffleAmount==3)
            begin = setInterval(animasyon, 1000);
        else
            begin = setInterval(animasyon, 200);

    });

    $(document).on("mouseover", "#puzzle", function() {

        if (shuffleFinished) {

            available = getAvailables(empty, "0");

            $(".imgP").css("opacity", "0.4");

            for (i = 0; i < available.length; i++) {
                $("." + available[i]).css("opacity", "1");
                $("." + available[i]).addClass("available");

            }
        }

    });

    $(document).on("mouseout", "#puzzle", function() {

        if (shuffleFinished) {
            $(".imgP").css("opacity", "1");

        }

    });

    function isSolved() {

        for (i = 0; i < 3; i++) {
            for (j = 0; j < 3; j++) {

                if (i != 0 || j != 0) {

                    var string = i + "-" + j;

                    if (!$("#" + string).hasClass(string)) {
                        return;
                    }
                }


            }
        }

        $("#solveText").text("F5 To Restart");
      
  
       $("#wonArea").css("display", "inline");
        $('#congText').animate({fontSize: "+50px"});
        $('#congText').css("font-size", "350px");

        $("#puzzleArea").css("opacity", "0.4");
    }

    $(document).on("click", ".available", function() {

        $(".available").removeClass("available");

        var itemClasses = $(this).attr('class').split(' ');
        if (itemClasses[1] == "available")
            var item = itemClasses[2];
        else
            var item = itemClasses[1];

        top = (parseInt(item[0]) - parseInt(empty[0]));
        left = (parseInt(item[2]) - parseInt(empty[2]));

        if (top != 0) {
            $("." + item).animate({
                top: "-=" + (top * 150 + top * 2) + "px",
            }, 50, function() {

                $("." + item).addClass(empty);
                $("." + item).removeClass(item);
                choosen = empty;
                empty = item;
                $(".imgP").css("opacity", "0.4");

                isSolved();

            });

        } else if (left != 0) {
            $("." + item).animate({
                left: "-=" + (left * 150 + left * 2) + "px",
            }, 50, function() {

                $("." + item).addClass(empty);
                $("." + item).removeClass(item);
                choosen = empty;
                empty = item;
                $(".imgP").css("opacity", "0.4");

                isSolved();
            });
        }



    });


});