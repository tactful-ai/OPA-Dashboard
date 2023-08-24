<template>
    <div class="roles">
        <div class="page-heading">
            <img src="./../assets/roles.svg" alt="">
            <span> Roles </span>
        </div>
        <div class="btns-container">
            <input type="text" placeholder="Search for a Role">
            <button class='add-role'>Add +</button>
        </div>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Role</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody v-for="role in roles" :key='role.id'>
                    <tr>
                        <td>{{ role.name }}</td>
                        <td>{{ role.description }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script lang='ts'>
import { defineComponent } from "vue"

export default defineComponent({
    name: 'RolesView',
    data(){
        return {
            roles:[
                {
                    id: 1,
                    name: 'Admin',
                    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere earum iste deleniti, maxime voluptates et saepe tempore, laboriosam natus expedita harum necessitatibus officiis facilis! Et sapiente saepe molestias quisquam perferendis.'
                },
                {
                    id: 2,
                    name: 'Editor',
                    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae cumque quae quibusdam iusto soluta a est quam corrupti, delectus nihil perspiciatis? Amet, obcaecati adipisci! Similique quia nesciunt ipsam eaque qui iste ad, inventore quo nam omnis fugiat ab sapiente cumque voluptatum deleniti consectetur, laborum quis, eum porro alias dolorum! Repellat!'
                },
                {
                    id: 3,
                    name: 'Author',
                    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam consequuntur adipisci fuga tempore distinctio beatae facere recusandae quibusdam totam ducimus explicabo dolores, ipsum facilis! Non rem libero cum vitae omnis molestiae asperiores ut iure neque reprehenderit debitis ipsa iste doloribus, dolorem nam dolores enim et. Eveniet dolor dolorum perspiciatis obcaecati? Quod, soluta saepe! Tempora, blanditiis eos perspiciatis consectetur asperiores maxime facilis debitis rem repellendus, accusantium deleniti iure reiciendis, quia enim. Voluptatum doloribus dignissimos itaque officiis facere incidunt vitae ratione natus. Pariatur nostrum aperiam dolor et ipsum, quo omnis repellat quidem, consequatur quia vel vitae quasi cupiditate totam ipsa magni perferendis.'
                },
                {
                    id: 4,
                    name: 'Contributor',
                    description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aut, dolorum. Sit quasi similique dicta tempore omnis magni libero minima dolorem illo perspiciatis laboriosam eos, vitae ducimus! Quasi commodi expedita obcaecati.'
                },
                {
                    id: 5,
                    name: 'Subscriber',
                    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet, animi doloribus vel libero consequuntur tenetur quod reprehenderit. Ducimus, porro quo.'
                },
                {
                    id: 6,
                    name: 'Subscriber',
                    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet, animi doloribus vel libero consequuntur tenetur quod reprehenderit. Ducimus, porro quo.'
                }

            ]
        }
    }
})
</script>

<style scoped>
*{
    box-sizing: border-box;
}

.roles{
    top: 0;
    padding: 3em;
    width: 100%;
    height: 100vh;
    font-size: 62.5%;
    /* display: grid; */
}

.table-container{
    overflow-y: scroll;
    height: 75%;
}

table{
    text-align: left;
    overflow: hidden;
    box-shadow: 0 5px 10px #e1e5ee;
    border-radius: 3px;
    border: 1px solid #f2f2f2;
    overflow-y: scroll;
}

thead {
    box-shadow: 0 5px 10px #e1e5ee;
    position: sticky;
    top: 0;
    background: #F2F8FF;
    z-index: 1;
}

th {
    padding: 1rem 2rem;
    text-transform: uppercase;
    letter-spacing: 0.1rem;
    font-size: 1rem;
}

td {
    padding: 1rem 2rem;
    font-size: 1rem;
}

tbody tr {
    transition: transform 0.2s;
}

tbody tr:hover {
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
    transform: translateY(-5px);
}

.btns-container{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2em;
}

input{
    padding: 1em;
    border-radius: 0.5em;
    border: 1px solid #f2f2f2;
    width: 30%;
}

.add-role{
    padding: 1em 2em;
    border-radius: 0.5em;
    border: 1px solid #f2f2f2;
    background-color: #F2F8FF;
    color: #2c3e50;
    font-weight: bold;
    cursor: pointer;
    /*  add a transition to make the border black */
    transition: border-color 0.2s;
}

.add-role:hover{
    border-color: black;
}

.page-heading{
    display: flex;
    align-items: center;
    padding: .4em 0;
    justify-content: flex-start;
    align-content: center;
    margin-bottom: 1em;
}

.page-heading span{
    font-size: 2rem;
}

.page-heading img{
        width: 6em;
        height: 6em;
        margin: 0 3em;
}

span{
    font-size: 1rem;
}
</style>