var bulletTime1 = 0;
var lifeTime = 0;

var bullet_player1_material = new THREE.MeshLambertMaterial(
{
    color: 0x00ff00, 
    transparent: false
});

function shoot()
{
    if (keyboard.pressed("space") && bulletTime1 + 0.2 /* 0.8 speed up */ < clock.getElapsedTime())
    {
        bullet = new THREE.Mesh(
            new THREE.SphereGeometry(2),
            bullet_player1_material);
        scene.add(bullet);
        bullet.position.x = player1.graphic.position.x + 7.5 * Math.cos(player1.direction);
        bullet.position.y = player1.graphic.position.y + 7.5 * Math.sin(player1.direction);
        bullet.angle = player1.direction;
        player1.bullets.push(bullet);
        bulletTime1 = clock.getElapsedTime();
    } 

    // move bullets
    var moveDistance = 5;

    for (var i = 0; i < player1.bullets.length; i++)
    {
        player1.bullets[i].position.x += moveDistance * Math.cos(player1.bullets[i].angle);
        player1.bullets[i].position.y += moveDistance * Math.sin(player1.bullets[i].angle);
    }

}

function collisions()
{
    bullet_collision();
    player_collision();
    ennemies_bullet_collision();
    ennemies_collision();
    player_ennemy_collision();
    player_falling();
}

function bullet_collision()
{
    //collision between bullet and walls
    for (var i = 0; i < player1.bullets.length; i++)
    {
        if (Math.abs(player1.bullets[i].position.x) >= WIDTH / 2 ||
            Math.abs(player1.bullets[i].position.y) >= HEIGHT / 2)
        {
            scene.remove(player1.bullets[i]);
            player1.bullets.splice(i, 1);
            i--;
        }
    }

}

function ennemies_bullet_collision()
{
    //collision between bullet and ennemies
    for (var i = 0; i < player1.bullets.length; i++)
    {
        for (var j = 0; j < ennemies.length; ++j)
        {
            if (ennemies[j].graphic !== undefined   && Math.abs(player1.bullets[i].position.x - ennemies[j].graphic.position.x) < 8
                                                    && Math.abs(player1.bullets[i].position.y - ennemies[j].graphic.position.y) < 8)
            {
                // remove ennemy
                scene.remove(ennemies[j].graphic);
                ennemies.splice(j, 1);
                j--;

                // remove bullet
                scene.remove(player1.bullets[i]);
                player1.bullets.splice(i, 1);
                i--;
            }
        }
    }
}

function player_collision()
{
    //collision between player and walls
    var x = player1.graphic.position.x + WIDTH / 2;
    var y = player1.graphic.position.y + HEIGHT / 2;

    if (x < 0)
        player1.graphic.position.x -= x;
    if ( x > WIDTH )
        player1.graphic.position.x -= x - WIDTH;
    if ( y < 0 )
        player1.graphic.position.y -= y;
    if ( y > HEIGHT )
        player1.graphic.position.y -= y - HEIGHT;

}

function ennemies_collision()
{
    for (var i = 0; i < ennemies.length; ++i)
    {
        var x = ennemies[i].graphic.position.x + WIDTH / 2;
        var y = ennemies[i].graphic.position.y + HEIGHT / 2;

        if (x < 0)
            ennemies[i].graphic.position.x -= x;
        if ( x > WIDTH )
            ennemies[i].graphic.position.x -= x - WIDTH;
        if ( y < 0 )
            ennemies[i].graphic.position.y -= y;
        if ( y > HEIGHT )
            ennemies[i].graphic.position.y -= y - HEIGHT;
    }
}

function player_ennemy_collision()
{
    for (var i = 0; i < ennemies.length; ++i)
    {
        if (lifeTime + 1.5 < clock.getElapsedTime() // he does not loses health twice in a row
            && Math.abs(player1.graphic.position.x - ennemies[i].graphic.position.x) < 16
            && Math.abs(player1.graphic.position.y - ennemies[i].graphic.position.y) < 16)
        {
            if (player1.life > 1)
                --player1.life;
            else
                player1.dead();
            lifeTime = clock.getElapsedTime();
        }
    }
}

function player_falling()
{
    var nb_tile = 10;
    var sizeOfTileX = WIDTH / nb_tile;
    var sizeOfTileY = HEIGHT / nb_tile;
    var x = player1.graphic.position.x | 0;
    var y = player1.graphic.position.y | 0;
    var length = noGround.length;
    var element = null;

    for (var i = 0; i < length; i++) {
        element = noGround[i];

        var tileX = (element[0]) | 0;
        var tileY = (element[1]) | 0;
        var mtileX = (element[0] + sizeOfTileX) | 0;
        var mtileY = (element[1] + sizeOfTileY) | 0;

        if (lifeTime + 1.5 < clock.getElapsedTime() // he does not loses health twice in a row
            && (x > tileX)
            && (x < mtileX)
            && (y > tileY) 
            && (y < mtileY))
        {
            if (player1.life > 1)
                --player1.life;
            else
                player1.dead();
            lifeTime = clock.getElapsedTime();
        }
    }

}
