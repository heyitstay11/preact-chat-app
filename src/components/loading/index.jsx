import './style.css'
import loaderImg from '../../favicon.svg'

const Loader = () => (
    <div class="loader flex flex-col items-center justify-center min-w-full">
        <img class="loader-img" src={loaderImg} height="200" width="200" alt="" />
    </div>
)

export default Loader