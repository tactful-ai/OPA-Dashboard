<template>
    <nav>
        <div class="logo-container">
            <img src="./../assets/dstnyEngage-logo.webp" alt="">
        </div>
        <ul>
            <!-- <li>
                <router-link to="/" class='menu-item'>
                    <img src="./../assets/dashboard.svg" alt="">
                    <span> Dashboard </span>
                </router-link> 
            </li> -->
            <li>
                <router-link to="/roles" class='menu-item'>
                    <img src="./../assets/roles.svg" alt="">
                    <span> Roles </span>
                </router-link> 
            </li>
            <li>
                <router-link to="/resources" class='menu-item'>
                    <img src="./../assets/resources.svg" alt="">
                    <span> Resources </span>
                </router-link> 
            </li>
            <li>
                <router-link to="/permissions" class='menu-item'>
                    <img src="./../assets/permissions.svg" alt="">
                    <span> Permissions </span>
                </router-link> 
            </li>
            <li>
                <router-link to="/tag" class='menu-item'>
                    <img src="./../assets/tag.svg" alt="">
                    <span> Tags </span>
                </router-link>
            </li>
            <li>
                <router-link to="/editor" class='menu-item'>
                    <img src="./../assets/editor.svg" alt="">
                    <span> Code Editor </span>
                </router-link> 
            </li>
        </ul>
    </nav>
</template>

<script>
export default {

}
</script>

<style scoped>
    *{
        font-size: 62.5%;
        margin: 0;
        padding: 0;
    }
    
    nav {
    padding: 30px;
    height: 100%;
    }

    nav a {
    font-weight: bold;
    color: white;
    }

    nav a.router-link-exact-active {
    color: #ff8737;
    }

    nav {
        background-color: #4361EE;
        float: left;
        position: relative;
        z-index: 1;
        top: 0;
        left: 0;
        padding: 1em;
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 13%;
        box-shadow: 10px 0 10px -10px lightblue;
    }

    nav img {
        width: 100%;
        /* margin-bottom: 10em; */
    }

    .logo-container{
        padding: 1em;
        border-radius: 0.5em;
        background-color: white;
        margin-bottom: 2em;
    }

    ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
    }

    li{
        margin: 1em 0;
        padding: 1em 0;
        border-radius: 1em;
        transition: .3s;
    }

    li a {
    display: flex;
    align-items: center;
    gap: .7em;
    padding: .4em 0;
    text-decoration: none;
    color: lightgray;
    }

    li:hover {
        /* background-color: rgb(49, 111, 255); */
        background-color: white;
    }
    
    .menu-item{
        display: flex;
        align-items: center;
        padding: .4em 0;
        text-decoration: none;
        justify-content: flex-start;
    }

    .menu-item img{
        width: 18em;
        height: 18em;
        margin: 0 2em 0 10em;
        color: white;
    }

    li span{
        font-size: 1rem;
        color: lightgrey;
    }

    li:hover span{
        color: #4361EE;
    }

    li img{
        /* change the color of the svg to white */
        filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%);
    }

    li:hover img{
        /* change the color of the svg to #4361EE */
        filter: invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%);
    }
</style>