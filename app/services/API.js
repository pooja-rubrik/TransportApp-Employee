
const base_url = {
    API_URL: 'http://10.0.7.127:8050', 

};
export {base_url};

const api = {
    employee:'/employee',
    default_login: '/login',
    default_logout: '/logout',
    register_admin: '/admin',
    utility: '/utility',
    pick_submit: '/daily/login/update',
    drop_submit: '/daily/logout/update',
    logout_emp: '/logout',
    daily_login: '/daily/login',
    daily_logout: '/daily/logout',
    daily_login_by_time: '/daily/login/time',
    daily_logout_by_time: '/daily/logout/time',
    next_day_login: '/nextday/login',
    next_day_logout: '/nextday/logout',
    next_day_login_by_time: '/nextday/login/time',
    next_day_logout_by_time: '/nextday/logout/time',
    get_driver: '/driver',
    reschedule_roster_pick: '/login/exception/reschedule',
    cancel_roster_pick: '/login/exception/cancel',
    reschedule_roster_drop: '/logout/exception/reschedule',
    cancel_roster_drop: '/logout/exception/cancel',
    driver_emp_list: '/driver/trip/vehicle',
    driver_trip_list: '/driver/trip/list',
    driver_trip: '/driver/trip'
}

export default api;