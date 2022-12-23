import {render} from '@testing-library/vue'
import Administrator from "@/pages/administrator";


test('renders base button', () => {
    const {debug} = render(Administrator)

    debug()
})
