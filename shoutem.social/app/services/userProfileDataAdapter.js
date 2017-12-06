import * as _ from 'lodash';

export function adaptSocialUserForProfileScreen(user) {
    return {
        id: _.toString(user.id),
        legacyId: parseInt(user.id, 10),
        profile: {
            firstName: user.first_name,
            lastName: user.last_name,
            nickname: user.screen_name,
            image: user.profile_image_url,
        },
        username: user.email,
    }
}

export function adaptUserForSocialActions(user) {
    return {
        id: parseInt(user.legacyId, 10),
        first_name: user.profile.firstName,
        last_name: user.profile.lastName,
        screen_name: user.profile.nickname,
        email: user.username,
        profile_image_url: user.profile.image,
        name: `${user.profile.firstName} ${user.profile.lastName}`
    };
}
