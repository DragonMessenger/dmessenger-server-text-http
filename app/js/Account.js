class Account {
	static changePassword() {
		var newPasswordValue = document.getElementById('new-password').value;
		var retypeNewPasswordValue = document.getElementById('retype-new-password').value;
		var oldPasswordValue = document.getElementById('old-password').value;

		if (newPasswordValue != retypeNewPasswordValue) { document.getElementById('account-password-status').innerHTML = "Check 'New password' and 'Retype new password'"; }
		else {
			document.getElementById('account-password-status').innerHTML = "The password is changing, please wait.";
			xhttp.open("POST", window.WEBAPP_ENDPOINT + "/api/auth/password/change", true);
			xhttp.setRequestHeader("Content-type", "application/json");
			xhttp.send(JSON.stringify({
				"oldPassword": oldPasswordValue,
				"newPassword": newPasswordValue
			}));
			xhttp.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					document.getElementById('account-password-status').innerHTML = "Password changed! Redirecting to login page...";
					window.location.href = "../../login";
				}
				if (this.readyState == 4 && this.status == 400) {
					document.getElementById('account-password-status').innerHTML = "Old password is invalid.";
				}
				if (this.readyState == 4 && this.status == 500 || this.status == 501) {
					document.getElementById('account-password-status').innerHTML = "Something went wrong...";
				}
				if (this.readyState == 4 && this.status == 403 || this.status == 401) {
					document.getElementById('account-password-status').innerHTML = "You are not allowed to change password";
				}
			}
		}
	}
	static deleteAccount(target_content) {
		xhttp.open("DELETE", window.WEBAPP_ENDPOINT + "/api/auth/delete", true);
		xhttp.setRequestHeader("Content-type", "application/json");
		xhttp.send(JSON.stringify({
			"username": target_content
		}));
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				console.log('[Account.deleteAccount] Account with username ' + target_content + ' was deleted from instance')
			}
		}
	}
}