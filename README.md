#Pixaint

Pixaint is a pixel art paint that returns a css code. So if you want to add some pixel art to you website you just have to paste the html & css code you get in the code of your website.  

In the "samples" folder you can find the superman logo and a retro mario done with **Pixaint**.

###Content

1. Motivation behind the project
2. The code
3. For contributors

### Motivation behind the project

Some time ago I was working on a website when suddenly I decided to add some pixel art to it. I just needed an image type that, even if you would zoom on it, the quality would not go lower. I discovered the SVGs but they didn't worked for pixel art, since some lines between the "pixels" would appear. I googled how to do pixel art with css and discovered [this tutorial](https://coderwall.com/p/0lb-qq/pixel-art-without-images). It worked but the time needed for one image was way to big and I didn't wanted to spend that much time.

That's why I created this. Even if it has a lot of work left for being a high-quality software it works for basic pixel art very well.

### The code

I used ```javascript``` for the code and ```html``` and ```css``` for the design. If you are a ```javascript``` developer, you might now that there are a lot of frameworks that really help for doing the job. For this project I used [jQuery](https://jquery.com/), [FileSaver](https://github.com/eligrey/FileSaver.js/) and [FontAwesome](http://fontawesome.io/).

#### explanation

I divided the ```javascript``` code into two files (```desing.js``` and ```app.js```). The first one works as an intermediary between the html and the code. Everytime you call an alert (for a new file, for choosing the color or for creating the code) or when you hover over the nav bar you are going through ```design.js```.

```app.js``` on the other hand is where the "real" code is. When you paint something, when you start a new file or when you create the code you are going through ```app.js```.

###### creating a new file
When you start a new file you create a grid made of 25px x 25px squares (in later updates it would be nice if the user is able to chose the grid size). These squares are filled with "X", which means that they are empty. At first you see the squares divided, you can toggle those divisions by clicking the button "margins on" on the nav.

###### painting
The painting works pretty easily. The grid is filled with events (in the ```gridEvents()``` function) and after you choose a color and trigger one of the events, the ```background-color``` property of the square-div changes to the color you chose. The erasing works by changing the ```background-color``` property to white and adding an "X" to the content.

###### export
The most complicated part of the code is where the pixel art is exported to a css code. Everything is in the ```downloadFile()``` function. At first the pixel where the whole shadow comes from is set in the ```start.pixel``` variable. Then, whith some ```for``` loops the other squares are set in other variables that work as a family where the row of ```start.pixel``` is his father ```start.papa```, the other pixels in that same row are his siblings ```start.sib```, the other rows are its uncles (```start.papa.sib```) and the pixels in the other rows are his cousins (```start.papa.sib.sons```). So now there is a variable for every pixel in the grid. The next part of the function is where the distances between every square are calculated and later on added to the css code (```css.code```). At least, the FileSaver framework is used to download the file with the code.

#### For contributors

Feel free to change whatever you think that has to be changed. If you think the desing is ugly or the code needs improvements, just do your change.

Also, I am 17 and this is the first project I upload to GitHub. I am very glad to read every correction you have for me (Even if those are grammar/spelling mistakes) so just don´t keep anything.

Thanks a lot for taking time to dive into this project,

Sincerely,

Manuel Cárdenas
