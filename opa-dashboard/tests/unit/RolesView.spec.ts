import { shallowMount } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import RolesView from '@/views/Roles/RolesView.vue'

jest.mock('axios')

describe('RolesView.vue', () => {
    let wrapper: any;

    beforeEach(() => {
        wrapper = shallowMount(RolesView)
    })

    it('renders the table when roles is not empty' , async () => {
        const roles = [
            {
                id: 1,
                name: 'admin',
                description: 'Administrator'
            },
            {
                id: 2,
                name: 'user',
                description: 'User'
            }
        ]
        expect(wrapper.find('.table-container').exists()).toBe(true)
    })
})
