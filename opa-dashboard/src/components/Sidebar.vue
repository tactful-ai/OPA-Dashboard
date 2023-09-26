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

<script lang="ts">
/**
 * A component used in all pages to display the sidebar for navigation.
 * @displayName Side Bar
 */
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
    color: #2c3e50;
    }

    nav a.router-link-exact-active {
    color: #ff8737;
    }

    nav {
        background-color: #F2F8FF;
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
        margin-bottom: 10em;
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
    }

    li:hover {
        /* background-color: rgb(49, 111, 255); */
        background-color: #CDE77F;
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
    }

    span{
        font-size: 1rem;
    }

</style>

