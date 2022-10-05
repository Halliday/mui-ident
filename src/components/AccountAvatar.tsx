import { Avatar, AvatarProps } from "@mui/material";
import React from "react";
import { useSession } from "../session";
import { stringAvatar } from "../tools";

export type MyAccountAvatarProps = AvatarProps;

export const MyAccountAvatar = React.forwardRef(function MyAccountAvatar(props: MyAccountAvatarProps, ref: React.Ref<any>) {
    const { userinfo, status: reason } = useSession();

    let avatar: JSX.Element;

    if (userinfo) {
        const name = userinfo.preferred_username || userinfo.email;
        if (userinfo.picture) {
            avatar = <Avatar {...props} ref={ref} alt={name} src={userinfo.picture} />;
        } else if (name) {
            avatar = <Avatar {...props} ref={ref} alt={name} {...stringAvatar(name)} />;
        } else {
            avatar = <Avatar {...props} ref={ref} />
        }
        avatar = <AccountAvatar name={userinfo.preferred_username || userinfo.email || "?"} picture={userinfo.picture} {...props} ref={ref} />;
    } else {

        avatar = <Avatar {...props} ref={ref} />
    }

    return avatar;
});

export interface AccountAvatarProps extends AvatarProps {
    name: string,
    picture?: string,
}

export const AccountAvatar = React.forwardRef(function AccountAvatar(props: AccountAvatarProps, ref: React.Ref<any>) {
    const { name, picture, ...avatarProps } = props;
    let avatar: JSX.Element;

    if (picture) {
        avatar = <Avatar {...avatarProps} ref={ref} alt={name} src={picture} />;
    } else if (name) {
        avatar = <Avatar {...avatarProps} ref={ref} alt={name} {...stringAvatar(name)} />;
    } else {
        avatar = <Avatar {...avatarProps} ref={ref} />
    }

    return avatar;
});