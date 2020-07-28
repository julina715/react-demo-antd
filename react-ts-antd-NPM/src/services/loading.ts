import Loadable from 'react-loadable';
import loading from '../components/RouteLoading';
/**
 * 懒加载函数
 * @param loader 动态import
 */
const asyncLoader = <Props>(
    loader: () => Promise<React.ComponentType<Props> | { default: React.ComponentType<Props> }>
) =>
    Loadable({
        loader,
        loading
    });

export default asyncLoader;
